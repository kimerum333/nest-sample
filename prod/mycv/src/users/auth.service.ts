import { Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    signup(email: string, password: string) {

    }
    signin() {

    }
}