import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictLocationService } from './district.location.service';
import { District } from './entities/district.entity';
import { Province } from './entities/province.entity';
import { Ward } from './entities/ward.entity';
import { LocationController } from './locations.controller';
import { ProvinceLocationService } from './province.location.service';
import { WardLocationService } from './ward.location.service';

@Module({
  providers: [
    ProvinceLocationService,
    DistrictLocationService,
    WardLocationService,
  ],
  imports: [TypeOrmModule.forFeature([District, Ward, Province])],
  controllers: [LocationController],
  exports: [ProvinceLocationService, DistrictLocationService],
})
export class LocationsModule {}
