import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const email = dto.email;
    const hash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: { email, hash },
    });

    return user;
  }

  signin() {
    return { msg: 'signin service called' };
  }
}
