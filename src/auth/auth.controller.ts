import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { ConfigService } from '@nestjs/config';
import { BadRequestResponse } from 'src/common/response.type.common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBadRequestResponse({
    description: 'Thông tin không hợp lệ',
    type: BadRequestResponse,
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiOperation({ summary: 'Đăng nhập web' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('init-sa')
  @Public()
  async initSa(@Body() body: { password: string }) {
    return this.authService.initSa(body.password);
  }
}
