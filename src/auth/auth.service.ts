import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const email = dto.email;
      const hash = await argon2.hash(dto.password);

      const user = await this.prisma.user.create({
        data: { email, hash },
      });

      // return user token
      const token = await this.signToken(user.id, user.email);
      return token;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
        }
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const email = dto.email;
    const hash = dto.password;

    // find user by email in prima
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // if you don't find user, throw error
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // compare password
    const passwordValid = await argon2.verify(user.hash, hash);

    // if password is not correct, throw error
    if (!passwordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    // return user token
    const token = await this.signToken(user.id, user.email);
    return token;
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token };
  }
}
