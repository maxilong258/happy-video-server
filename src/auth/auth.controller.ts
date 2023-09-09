import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto/auth.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me') 
  @UseGuards(JwtGuard)
  me(@Req() req: Request) {
    const header: any = req.headers
    return this.authService.me(header.authorization?.split(' ')[1])
  }
  
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto)
  }
  
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto)
  }
}
