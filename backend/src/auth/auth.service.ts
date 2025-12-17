import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerService } from '../customer/customer.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.customerService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken, user };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.customerService.create(registerDto);
    const { password, ...result } = user;
    return this.login(result);
  }

  async refreshTokens(userId: string) {
    const user = await this.customerService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return this.login(result);
  }

  async validateAccessToken(payload: JwtPayload) {
    const user = await this.customerService.findOne(payload.sub);
    if (!user) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }

  async validateRefreshToken(payload: JwtPayload) {
    const user = await this.customerService.findOne(payload.sub);
    if (!user) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }

  private generateAccessToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'access',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    });
  }

  private generateRefreshToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });
  }
}
