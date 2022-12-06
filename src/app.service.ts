import { Injectable } from '@nestjs/common';
import { UserRole } from './users/entities/user.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAppConfig() {
    return {
      user: {
        role: Object.values(UserRole),
      },
    };
  }
}
