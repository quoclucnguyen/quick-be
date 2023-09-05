import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({
      where: { username: username, isActive: true },
    });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      id: user.id,
      role: user.role,
      name: user.name,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async initSa(password: string) {
    if (password !== this.configService.get<string>('SA_PASSWORD')) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }
    const sa = await this.usersService.findOne({
      where: {
        role: UserRole.SA,
        isActive: true,
      },
    });
    if (sa) {
      throw new BadRequestException('Đã tồn tại tài khoản SA');
    }
    const user = new User();
    user.username = 'sa';
    user.passwordHash = await bcrypt.hash(
      this.configService.get<string>('SA_PASSWORD'),
      10,
    );
    user.name = 'SA';
    user.role = UserRole.SA;
    return this.usersService.save(user);
  }
}
