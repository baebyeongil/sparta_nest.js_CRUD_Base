import { Controller, Get, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login() {
    return await this.userService.login('test_id', 'test_new_p');
  }

  @Post('/signup')
  async createUser() {
    return await this.userService.createUser('test_id', 'test_name', 'test_pw');
  }

  @Put('/update')
  updateUser() {
    this.userService.updateUser('test_id', 'test_new_n', 'test_new_p');
  }
}
