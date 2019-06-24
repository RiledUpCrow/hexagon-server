import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseCredentials from './databaseCredentials';
import { EngineModule } from './engine/engine.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseCredentials), EngineModule],
})
export class AppModule {}
