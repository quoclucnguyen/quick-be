import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { getFileExtension, upload } from 'src/common/helper.common';
import { ImageEntity } from './entities/image.entity';
import { LoggedInUser } from 'src/users/entities/user.entity';

@Injectable()
export class ImagesService extends AbstractService<ImageEntity> {
  constructor(@InjectRepository(ImageEntity) repository: Repository<ImageEntity>) {
    super(ImagesService.name, repository);
  }

  async create(
    filename: string,
    url: string,
    createdBy: number,
  ): Promise<ImageEntity> {
    const image = this.repository.create({
      path: url,
      name: filename,
      createdBy: createdBy,
    });
    return await this.repository.save(image);
  }

  async uploadFile(
    createReadStream: any,
    filename: string,
    user?: LoggedInUser,
    type: string = '',
  ): Promise<number> {
    const today = new Date();
    const [day, month, year] = [
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
    ];
    const filenameOnServer = type + '_' + uuidv4() + getFileExtension(filename);
    const path = `./uploads/images/${year}/${month}/${day}`;
    const url = `uploads/images/${year}/${month}/${day}/${filenameOnServer}`;

    return upload(createReadStream, filenameOnServer, path, url)
      .then(async (result) => {
        if (result) {
          const image = await this.create(filenameOnServer, url, user?.id);
          return image.id;
        } else {
          return 0;
        }
      })
      .catch((error) => {
        throw new RuntimeException(error);
      });
  }

  async deleteFile(imageId: number, user: LoggedInUser) {
    return this.repository.update(
      { id: imageId },
      { isActive: false, updatedBy: user.id },
    );
  }
}
