import { Injectable } from '@nestjs/common';

@Injectable()

export class AuthService {
  
  signin() {
    return 'This is the signin route';
  }

  signup() {
    return 'This is the signup route';
  }

}
