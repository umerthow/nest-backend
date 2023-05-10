import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller({
  path: 'health',
  version: '1'
})
export class HealthController {
  @Get()
  healthCheck(@Res() res: Response): Response<string> {
    return res.status(200).send('OK');
  }
}
