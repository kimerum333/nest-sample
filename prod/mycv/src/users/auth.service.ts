import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes,scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        //see if email in use
        const users = await this.usersService.find(email);
        if(users.length){
            throw new BadRequestException('user already exists');
        }

        //hash users password
        //1. generate salt
        const salt=  randomBytes(8).toString('hex'); //8바이트 크기의 랜덤바이트 생성, 16진수로 변환.
        //2. hash salt and password together
        const hash = (await scrypt(password,salt, 32))as Buffer; //결과는 32만큼의 크기
        //3. join hashed result and salt(use . as )
        const result = salt+'.'+hash.toString('hex');

        //create new user and save
        const user = await this.usersService.create(email,result);
        //return the user
        return user;
    }
    async signin(email:string, password:string) {
        const [user] = await this.usersService.find(email);
        if(!user){
            throw new NotFoundException('user not found');
        }
        const [salt,storedHash] = user.password.split('.');
        const hash= (await scrypt(password,salt,32))as Buffer;
        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('bad password');
        }
        return user;
    }
}