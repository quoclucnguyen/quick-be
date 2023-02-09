import { Module } from '@nestjs/common';
import { OutletsService } from './outlets.service';
import { OutletsController } from './outlets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletEntity } from './entities/outlet.entity';
import { LocationsModule } from 'src/locations/locations.module';

@Module({
  controllers: [OutletsController],
  providers: [OutletsService],
  imports: [TypeOrmModule.forFeature([OutletEntity]), LocationsModule],
})
export class OutletsModule {}
