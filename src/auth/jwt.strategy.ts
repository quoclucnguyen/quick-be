import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserRole } from 'src/users/entities/user.entity';
import * as dayjs from 'dayjs'
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; username: string; role: UserRole; token: string }) {
    this.logger.info({ accessTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), user: payload });
    const user = await this.usersService.findOne({
      where: {
        id: payload.sub,
        token: payload.token,
        isActive: true,
      },
    });
    if (user === null) {
      throw new UnauthorizedException();
    }
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
