import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CredentialsDto } from './credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Controller('user')
export class AuthController {
  public constructor(private readonly userService: UserService) {}

  @Post('register')
  public async register(@Body() credentials: CredentialsDto) {
    const { username, password } = credentials;
    const user = await this.userService.createUser(username, password);
    const token = await this.userService.createToken(user);

    return { token, profile: user };
  }

  @Post('login')
  public async login(@Body() credentials: CredentialsDto) {
    const { username, password } = credentials;
    const user = await this.userService.getByCredentials(username, password);
    const token = await this.userService.createToken(user);

    return { token, profile: user };
  }

  @Get('profile')
  @UseGuards(AuthGuard())
  public async getProfile(@Req() req: Request): Promise<{ username: string }> {
    return { username: req.user!.name };
  }
}
