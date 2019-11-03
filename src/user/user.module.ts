import { Module } from '@nestjs/common';
import Token from './token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
