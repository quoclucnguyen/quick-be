import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import {
  IMAGE_EXT_ALLOWED,
  IMAGE_MAX_SIZE,
} from 'src/images/entities/image.entity';
import { ImagesService } from 'src/images/images.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerImageEntity } from './entities/customer-image.entity';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService extends AbstractService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity)
    repository: Repository<CustomerEntity>,
    private readonly imagesService: ImagesService,
  ) {
    super(CustomersService.name, repository);
  }
  async create(createCustomerDto: CreateCustomerDto, user: LoggedInUser) {
    /**
     * Kiểm tra file ext, kích thước
     */
    if (createCustomerDto.files.length === 0) {
      throw new BadRequestException('Files không được để trống.');
    }
    for (let i = 0; i < createCustomerDto.files.length; i++) {
      if (!IMAGE_EXT_ALLOWED.includes(createCustomerDto.files[i].mimetype)) {
        throw new BadRequestException('File hình ảnh không hợp lệ');
      }
      if (createCustomerDto.files[i].size > IMAGE_MAX_SIZE) {
        throw new BadRequestException('File dung lượng cao hơn cho phép');
      }
    }
    /**
     * Upload hình ảnh
     */
    const listImagesId = [];
    for (let i = 0; i < createCustomerDto.files.length; i++) {
      const imageId = await this.imagesService.uploadFile(
        await createCustomerDto.files[0].buffer,
        createCustomerDto.files[0].originalname,
        user,
        '_IMAGE',
      );
      listImagesId.push(imageId);
    }
    const customer = this.repository.create(createCustomerDto);
    customer.customerImages = listImagesId.map((id) => {
      const customerImage = new CustomerImageEntity();
      customerImage.imageId = id;
      customerImage.createdBy = user.id;
      return customerImage;
    });
    customer.createdBy = user.id;
    return this.repository.save(customer);
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  async checkPhone(phone: string) {
    const customer = await this.repository.findOne({
      select: {
        id: true,
      },
      where: {
        phone: phone,
        isActive: true,
      },
    });
    if (customer) {
      return {
        success: false,
        message: 'Số điện thoại đã được nhận sampling.',
      };
    }
    return {
      success: true,
      message: null,
    };
  }
}
