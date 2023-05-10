import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('user')
export class UserController {
  @Post()
  createUser(@Res() res: Response): Response<string> {
    return res.status(200).send('OK');
  }
}
