import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { v4 as uuidv4 } from 'uuid';
import { getFileExtension, upload } from 'src/common/helper.common';
import { ImagesService } from 'src/images/images.service';
import { GiftsService } from 'src/gifts/gifts.service';

@Injectable()
export class CustomersService extends AbstractService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity)
    repository: Repository<CustomerEntity>,
    private dataSource: DataSource,
    private readonly imagesService: ImagesService,
    private readonly giftsService: GiftsService,
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
      where: { serialNumber: createCustomerDto.serialNumber, isActive: true },
    });
    if (serialNumberEntity) {
      throw new BadRequestException(
        'Mã S/N đã tham gia chương trình, vui lòng kiểm tra lại.',
      );
    }
    /**
     * Upload hình ảnh
     */
    const imageId = await this.imagesService.uploadFile(
      createCustomerDto.file.buffer,
      createCustomerDto.file.originalname,
      user,
      createCustomerDto.type,
    );

    const customer = this.repository.create(createCustomerDto);
    customer.createdBy = user.id;
    customer.imageId = imageId;

    const gifts = await this.giftsService.findAll({
      where: { isActive: true, quantity: MoreThan(0) },
    });
    if (gifts.length === 0) {
      customer.gift = null;
    } else {
      const gift = gifts[Math.floor(Math.random() * gifts.length)];
      customer.giftId = gift.id;
      customer.gift = gift;
    }
    return this.repository.save(customer);
  }
}
