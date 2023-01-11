import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DistrictLocationService } from './district.location.service';
import { ProvinceLocationService } from './province.location.service';
import { WardLocationService } from './ward.location.service';

@Injectable()
@Controller('location')
@ApiTags('Location')
@ApiBearerAuth()
export class LocationController {
  constructor(
    private readonly provinceLocationService: ProvinceLocationService,
    private readonly districtLocationService: DistrictLocationService,
    private readonly wardLocationService: WardLocationService,
  ) {}
  @Get('/province')
  @ApiOperation({ summary: 'Danh sách tỉnh' })
  getProvince() {
    return this.provinceLocationService.findAllWithoutCondition();
  }

  @Get('district/:provinceId')
  @ApiOperation({ summary: 'Danh sách quận huyện' })
  getDistrict(@Param('provinceId') provinceId: number) {
    return this.districtLocationService.findAll({
      where: {
        provinceId: provinceId,
      },
    });
  }

  @Get('ward/:districtId')
  @ApiOperation({ summary: 'Danh sách phường xã' })
  getWard(@Param('districtId') districtId: number) {
    return this.wardLocationService.findAll({
      where: {
        districtId: districtId,
      },
    });
  }

  @Get('district')
  @ApiOperation({ summary: 'Danh sách quận huyện' })
  getDistrictWithoutProvince() {
    return this.districtLocationService.findAllWithoutCondition();
  }

  @Get('ward')
  @ApiOperation({ summary: 'Danh sách phường xã' })
  getWardWithoutDistrict() {
    return this.wardLocationService.findAllWithoutCondition();
  }
}
