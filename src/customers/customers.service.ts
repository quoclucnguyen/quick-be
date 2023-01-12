import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { Between, DataSource, Like, MoreThan, Not, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { ImagesService } from 'src/images/images.service';
import { GiftsService } from 'src/gifts/gifts.service';
import { CustomerFilter } from './dto/customer.filter';
import { number } from 'joi';
import { CustomerHistoryEntity } from './entities/customer-history.entity';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { CustomerActionHistoryEntity } from './entities/customer-action-history.entity';

@Injectable()
export class CustomersService extends AbstractService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity)
    repository: Repository<CustomerEntity>,
    private dataSource: DataSource,
    private readonly imagesService: ImagesService,
    private readonly giftsService: GiftsService,
    private customerHistoryRepository: Repository<CustomerHistoryEntity>,
    private customerActionHistoryRepository: Repository<CustomerActionHistoryEntity>,
  ) {
    super(CustomersService.name, repository);
  }

  async create(
    createCustomerDto: CreateCustomerDto,
    user: LoggedInUser,
  ): Promise<CustomerEntity> {
    /**
     * Kiểm tra serialNumber
     */

    const serialNumberEntity = this.repository.findOne({
      where: {
        serialNumber: createCustomerDto.serialNumber,
        isActive: true,
        status: Not('reject'),
      },
    });
    if (serialNumberEntity) {
      throw new BadRequestException(
        'Mã S/N đã tham gia chương trình, vui lòng kiểm tra lại.',
      );
    }
    /**
     * Upload hình ảnh
     */
    const imageSNId = await this.imagesService.uploadFile(
      createCustomerDto.fileSN.buffer,
      createCustomerDto.fileSN.originalname,
      user,
      createCustomerDto.type + '_SN',
    );

    const imageReciptId = await this.imagesService.uploadFile(
      createCustomerDto.fileRecipt.buffer,
      createCustomerDto.fileRecipt.originalname,
      user,
      createCustomerDto.type + '_RECEIPT',
    );

    const customer = this.repository.create(createCustomerDto);
    customer.createdBy = user.id;
    customer.imageSNId = imageSNId;
    customer.imageReciptId = imageReciptId;

    const gifts = await this.giftsService.findAll({
      where: { isActive: true, quantity: MoreThan(0) },
    });
    if (gifts.length === 0) {
      customer.gift = null;
    } else {
      const gift = gifts[Math.floor(Math.random() * gifts.length)];
      customer.giftId = gift.id;
      customer.gift = gift;
      /**
       * Trừ đi quà đã ra tại đây.
       */
      await this.giftsService.update(
        { where: { id: gift.id } },
        { quantity: gift.quantity - 1 },
      );
    }
    /**
     * Thêm vào history
     */
    const history = this.customerHistoryRepository.create(customer);
    customer.customerHistories = [history];
    const actionHistory = this.customerActionHistoryRepository.create();
    actionHistory.action = 'new';
    customer.customerActionHistories = [actionHistory];

    return this.repository.save(customer);
  }

  async findAllWithFilter(input: CustomerFilter) {
    // TODO :Filter theo ngày mua
    const startDate = new Date(input?.fromDate ?? '2022-01-01');
    const endDate = new Date(input?.toDate ?? '3000-01-01');
    return this.repository
      .findAndCount({
        take: input.take,
        skip: input.skip,
        where: {
          isActive: true,
          name: Like(input?.name ? `%${input.name}%` : '%%'),
          phone: Like(input?.phone ? `%${input.phone}%` : '%%'),
          email: Like(input?.email ? `%${input.email}%` : '%%'),
          idCardNumber: Like(
            input?.idCardNumber ? `%${input.idCardNumber}%` : '%%',
          ),
          seriesPurchase: Like(
            input?.seriesPurchase ? `%${input.seriesPurchase}%` : '%%',
          ),
          serialNumber: Like(
            input?.serialNumber ? `%${input.serialNumber}%` : '%%',
          ),
          createdAt: Between(startDate, endDate),
          status: input?.status ? input.status : undefined,
          type: input?.type ? input.type : undefined,
          giftId: input.giftId !== undefined ? input.giftId : undefined,
        },
        order: {
          id: 'DESC',
        },
      })
      .then(([entities, count]) => {
        return {
          entities,
          count,
        };
      });
  }

  async detail(id: number) {
    return this.repository.findOne({
      where: { id: id, isActive: true },
    });
  }

  async edit(id: number, input: EditCustomerDto, user: LoggedInUser) {
    /**
     * Update customer
     */
    const customer = await this.repository.findOne({ where: { id } });
    if (customer === null) {
      throw new BadRequestException('Không tìm thấy khách hàng theo ID đã gửi');
    }

    // Kiểm tra mã SN có trùng với người khác hay không
    const customerSNCheck = await this.repository.findOne({
      where: {
        serialNumber: input.serialNumber,
        id: Not(id),
        isActive: true,
        status: Not('reject'),
      },
      select: {
        id: true,
      },
    });
    if (customerSNCheck) {
      throw new BadRequestException(
        'Mã S/N đã tham gia chương trình, vui lòng kiểm tra lại.',
      );
    }

    const result = await this.repository.update(
      { id: id },
      { ...input, updatedBy: user.id },
    );

    /**
     * Tao customerHistory
     */
    const customerHistory = this.customerHistoryRepository.create(input);
    customerHistory.imageReciptId = customer.imageReciptId;
    customerHistory.imageSNId = customer.imageSNId;
    customerHistory.customerId = customer.id;
    customerHistory.createdBy = user.id;

    await this.customerHistoryRepository.save(customerHistory);
    return true;
  }

  async confirm(id: number, user: LoggedInUser) {
    const customer = await this.repository.findOne({
      where: { id, isActive: true },
      relations: {
        gift: true,
      },
    });
    if (customer === null) {
      throw new BadRequestException('Không tìm thấy khách hàng theo ID đã gửi');
    }
    switch (customer.status) {
      case 'new':
        customer.status = 'done';
        customer.updatedBy = user.id;
        await this.repository.save(customer);
        await this.customerActionHistoryRepository.save({
          customerId: customer.id,
          action: 'done',
          createdBy: user.id,
        });
        return true;
      case 'reject':
        customer.status = 'done';
        customer.updatedBy = user.id;
        await this.repository.save(customer);
        if (customer.giftId) {
          await this.giftsService.update(
            { where: { id: customer.giftId } },
            { quantity: customer.gift.quantity - 1 },
          );
        }

        await this.customerActionHistoryRepository.save({
          customerId: customer.id,
          action: 'done',
          createdBy: user.id,
        });
        return true;
      default:
        throw new BadRequestException(
          'Thông tin không hợp lệ vui lòng thử lại.',
        );
    }
  }

  async reject(id: number, user: LoggedInUser) {
    const customer = await this.repository.findOne({
      where: { id, isActive: true },
      relations: {
        gift: true,
      },
    });
    if (customer === null) {
      throw new BadRequestException('Không tìm thấy khách hàng theo ID đã gửi');
    }

    switch (customer.status) {
      case 'new':
      case 'done':
        customer.status = 'reject';
        customer.updatedBy = user.id;
        await this.repository.save(customer);
        if (customer.giftId) {
          await this.giftsService.update(
            { where: { id: customer.giftId } },
            { quantity: customer.gift.quantity + 1 },
          );
        }
        await this.customerActionHistoryRepository.save({
          customerId: customer.id,
          action: 'reject',
          createdBy: user.id,
        });
        return true;
      default:
        throw new BadRequestException(
          'Thông tin không hợp lệ vui lòng thử lại.',
        );
    }
  }
}
