import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin/login')
  async loginAdmin(@Body() body: { login: string; password: string }) {
    return this.authService.loginAdmin(body.login, body.password);
  }
}

