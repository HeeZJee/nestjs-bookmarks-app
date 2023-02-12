import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      const email = dto.email;
      const hash = await argon2.hash(dto.password);

      const user = await this.prisma.user.create({
        data: { email, hash },
      });

      delete user.hash;

      return user;
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
    
    // all good, return user
    delete user.hash;
    return user;
    
    return { msg: 'signin service called' };
  }
}
