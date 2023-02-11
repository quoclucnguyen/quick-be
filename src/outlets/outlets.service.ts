import { BadRequestException, Injectable } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { DistrictLocationService } from 'src/locations/district.location.service';
import { ProvinceLocationService } from 'src/locations/province.location.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { DataSource, In, Like, Not, Repository } from 'typeorm';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { OutletFilter } from './dto/outlet.filter.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { OutletEntity } from './entities/outlet.entity';

@Injectable()
export class OutletsService extends AbstractService<OutletEntity> {
  constructor(
    @InjectRepository(OutletEntity)
    repository: Repository<OutletEntity>,
    private dataSource: DataSource,
    private readonly provinceLocationService: ProvinceLocationService,
    private readonly districtLocationService: DistrictLocationService,
  ) {
    super(OutletsService.name, repository);
  }

  async create(input: CreateOutletDto, user: LoggedInUser) {
    /**
     * Check outlet code unique
     */
    if (input.code) {
      const outletWithCode = await this.repository.findOne({
        where: {
          code: input.code,
          isActive: true,
        },
      });
      if (outletWithCode) {
        throw new BadRequestException(
          `Outlet code "${input.code}" đã có, vui lòng kiểm tra lại.`,
        );
      }
    }
    const province = await this.provinceLocationService.findOne({
      where: { id: input.provinceId },
    });
    if (province === null) {
      throw new BadRequestException(
        `Không tìm thấy ID tỉnh: ${input.provinceId}`,
      );
    }
    const district = await this.districtLocationService.findOne({
      where: { id: input.districtId },
    });
    if (district === null) {
      throw new BadRequestException(
        `Không tìm thấy ID huyện: ${input.districtId}`,
      );
    }
    const outlet = this.repository.create(input);
    outlet.createdBy = user.id;
    return this.repository.save(outlet);
  }

  findAllWithFilter(filter: OutletFilter) {
    return this.repository
      .findAndCount({
        take: filter.take,
        skip: filter.skip,
        where: {
          isActive: true,
          name: Like(filter?.name ? `%${filter.name}%` : '%%'),
          code: Like(filter?.code ? `%${filter.code}%` : '%%'),
          address: Like(filter?.address ? `%${filter.address}%` : '%%'),
          provinceId:
            filter.provinceId !== undefined ? filter.provinceId : undefined,
          districtId:
            filter.districtId !== undefined ? filter.districtId : undefined,
        },
        order: {
          id: 'DESC',
        },
        relations: {
          province: true,
          district: true,
        },
      })
      .then(([entities, count]) => {
        return {
          entities,
          count,
        };
      });
  }

  remove(id: number) {
    return this.repository.update({ id }, { isActive: false });
  }

  async updateOutlet(
    id: number,
    input: UpdateOutletDto,
    userLogin: LoggedInUser,
  ) {
    const outlet = await this.repository.findOne({
      where: { id: id, isActive: true },
    });

    if (outlet === null) {
      throw new BadRequestException('Không tìm thấy outlet với ID: ' + id);
    }

    /**
     * Check outlet code unique
     */
    if (input.code) {
      const outletWithCode = await this.repository.findOne({
        where: {
          code: input.code,
          isActive: true,
          id: Not(id),
        },
      });
      if (outletWithCode) {
        throw new BadRequestException(
          `Outlet code ${input.code}} đã có, vui lòng kiểm tra lại.`,
        );
      }
    }
    if (input.address) outlet.address = input.address;
    if (input.code) outlet.code = input.code;
    if (input.name) outlet.name = input.name;
    if (input.provinceId) outlet.provinceId = input.provinceId;
    if (input.districtId) outlet.districtId = input.districtId;
    outlet.updatedBy = userLogin.id;
    return this.repository.save(outlet);
  }

  async import(input: CreateOutletDto[], user: LoggedInUser) {
    if (input.length === 0) {
      throw new BadRequestException('Dữ liệu trống');
    }
    /**
     * Kiểm tra mã outlet
     */
    const listOutletCodeError = [];
    const listProvinceId = [];
    const listDistrictId = [];
    for (let i = 0; i < input.length; i++) {
      const outletCheckCode = await this.repository.findOne({
        where: { isActive: true, code: input[i].code },
        select: { id: true, code: true },
      });
      if (outletCheckCode) {
        listOutletCodeError.push(outletCheckCode.code);
      }
      listProvinceId.push(input[i].provinceId);
      listDistrictId.push(input[i].districtId);
    }
    if (listOutletCodeError.length > 0) {
      throw new BadRequestException(
        listOutletCodeError.map((code) => `${code} đã có trong hệ thống`),
      );
    }
    const provinces = await this.provinceLocationService.findAll({
      select: {
        id: true,
      },
      where: {
        id: In(listProvinceId),
      },
    });

    const districts = await this.districtLocationService.findAll({
      select: {
        id: true,
      },
      where: {
        id: In(listDistrictId),
      },
    });
    const provinceIds =
      provinces.length > 0 ? provinces.map((province) => province.id) : [];
    const districtIds =
      districts.length > 0 ? districts.map((district) => district.id) : [];

    const listProvinceIdNotFound = [];
    const listDistrictIdNotFound = [];
    for (let i = 0; i < input.length; i++) {
      if (!provinceIds.includes(input[i].provinceId)) {
        listProvinceIdNotFound.push(input[i].provinceId);
      }
      if (!districtIds.includes(input[i].districtId)) {
        listDistrictIdNotFound.push(input[i].districtId);
      }
    }
    if (listProvinceIdNotFound.length > 0) {
      throw new BadRequestException(
        'Danh sách ID tỉnh không có trong hệ thống: ',
        listProvinceIdNotFound.join(', '),
      );
    }
    if (listDistrictIdNotFound.length > 0) {
      throw new BadRequestException(
        'Danh sách ID quận/huyện không có trong hệ thống: ',
        listDistrictIdNotFound.join(', '),
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < input.length; i++) {
        const outlet = this.repository.create(input[i]);
        outlet.createdBy = user.id;
        await queryRunner.manager.save(outlet);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new RuntimeException(err);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return { success: true };
  }
}
