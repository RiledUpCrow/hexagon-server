import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { Repository } from 'typeorm';
import Token from './token.entity';
import User from './user.entity';
import nanoid from 'nanoid';
import crypto from 'crypto';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(username: string, password: string): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { username } });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashed = await hash(password, 12);

    const user = new User();
    user.name = username;
    user.password = hashed;
    user.tokens = [];

    await this.userRepository.save(user);

    return user;
  }

  public async getByCredentials(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const result = await compare(password, user.password);
    if (!result) {
      throw new UnauthorizedException();
    }

    return user;
  }

  public async getByToken(rawToken: string): Promise<User> {
    const hashed = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const token = await this.tokenRepository.findOne({
      where: { token: hashed },
      relations: ['user'],
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    return token.user;
  }

  public async createToken(user: User): Promise<string> {
    const rawToken = await nanoid(48);
    const hashed = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const token = new Token();
    token.token = hashed;
    token.user = user;

    this.tokenRepository.save(token);

    return rawToken;
  }
}
