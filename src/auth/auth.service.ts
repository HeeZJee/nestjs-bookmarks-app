import { Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {
    signup() {
        return 'signup service called'; 
    };
    ;
    signin(){
        return 'signin service called';
    };
}
