import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineService } from './engine.service';
import Engine from './engine.entity';
import { EngineGateway } from './engine.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Engine])],
  providers: [EngineService, EngineGateway],
  controllers: [],
})
export class EngineModule {}
