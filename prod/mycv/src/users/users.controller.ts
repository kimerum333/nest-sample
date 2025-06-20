import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  Session,
  UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User){
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto ,@Session()session: any) {
    const user = await this.authService.signup(body.email,body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signIn(@Body() body:CreateUserDto, @Session()session: any){
    const user = await this.authService.signin(body.email,body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session()session: any){
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id, 10));
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id, 10));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id, 10), body);
  }
}
