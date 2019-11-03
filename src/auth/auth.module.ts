import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BearerStrategy } from './bearer.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, PassportModule.register({ defaultStrategy: 'bearer' })],
  controllers: [AuthController],
  providers: [BearerStrategy],
})
export class AuthModule {}
