import { Injectable, NotFoundException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {
        this.repo = repo;
    }
    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOneBy({ id });
    }
    find(email: string) {
        console.log('email',email);
        return this.repo.find({ where: { email:email } });
    }

    
    async update(id: number, attr: Partial<User>) {
        // we can call this as... update(1, {email}) or update(1,{email,password}) or.. so on
        const user = await this.repo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attr);
        return this.repo.save(user);

    }
    async remove(id: number) {
        const user = await this.repo.findOneBy({id});
        if(!user){
            throw new NotFoundException('user not found');
        }
        return this.repo.remove(user);
    }
}
