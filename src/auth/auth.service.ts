import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return { msg: 'signup service called' };
  }
  signin() {
    return { msg: 'signin service called' };
  }
}
