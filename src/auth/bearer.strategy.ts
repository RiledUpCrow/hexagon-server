import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UserService } from '../user/user.service';
import User from '../user/user.entity';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  public constructor(private readonly userService: UserService) {
    super();
  }

  public async validate(token: string): Promise<User> {
    const user = await this.userService.getByToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
