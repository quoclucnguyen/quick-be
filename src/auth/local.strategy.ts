import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate(@Request() req): Promise<any> {
    const { username, password, isAdminWeb } = req.body;
    const user = await this.authService.validateUser(
      username,
      password,
      isAdminWeb,
    );
    if (!user) {
      throw new BadRequestException('Tài khoản hoặc mật khẩu không chính xác');
    }
    return user;
  }
}
