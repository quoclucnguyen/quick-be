import { AbstractService } from '../common/abstract.service';
import { LoggedInUser, User, UserRole } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { UserFilter } from './dto/user.filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export class UsersService extends AbstractService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    private dataSource: DataSource,
  ) {
    super(UsersService.name, repository);
  }

  async create(input: CreateUserDto, userLogin: LoggedInUser) {
    {
      /**
       * Kiểm tra dữ liệu
       * {
       * user: 'unique'
       * }
       */
      const user = await this.findOne({
        select: { id: true },
        where: { isActive: true, username: input.username },
      });
      if (user) {
        throw new BadRequestException('Username đã tồn tại trong hệ thống.');
      }
    }

    const user = new User();
    user.role = input.role;
    user.name = input.name;
    user.username = input.username;
    user.passwordHash = await bcrypt.hash(input.password, 10);
    user.createdBy = userLogin.id;
    return this.repository.save(user);
  }
  findAllAndCount(filter: UserFilter) {
    return this.repository
      .findAndCount({
        where: {
          name: filter.name ? Like(`%${filter.name}%`) : null,
          username: filter.username ? Like(`%${filter.username}%`) : null,
        },
        take: filter.take,
        skip: filter.skip,
        order: {
          id: 'DESC',
        },
      })
      .then(([entities, count]) => {
        return { entities, count };
      });
  }

  async updateUser(input: UpdateUserDto, userLogin: LoggedInUser) {
    const user = await this.repository.findOne({
      select: { id: true },
      where: { id: input.id },
    });
    if (user === null) {
      throw new BadRequestException('Không tìm thấy user với ID: ' + input.id);
    }
    if (input.username) {
      const userWithUsername = await this.repository.findOne({
        select: { id: true },
        where: { username: input.username, id: Not(input.id) },
      });
      if (userWithUsername) {
        throw new BadRequestException(
          `Username: "${input.username}" đã tồn tại trong hệ thống`,
        );
      } else {
        user.username = input.username;
      }
    }
    if (input.password)
      user.passwordHash = await bcrypt.hash(input.password, 10);
    if (input.name) user.name = input.name;
    if (input.role) user.role = input.role;
    if (input.isActive !== null) user.isActive = input.isActive;
    user.updatedBy = userLogin.id;

    return this.repository.save(user);
  }
}
