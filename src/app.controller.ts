import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Controller 로서의 역할을 수행하겠다. > Nest.js 에게 전달
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // HTTP GET
  getHello(): string {
    return this.appService.getHello();
  }
}
