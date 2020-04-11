import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getData() {
    return { status: 200, message: 'Server is... well Serving...' };
  }
}
