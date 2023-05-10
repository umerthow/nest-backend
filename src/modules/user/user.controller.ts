import { IResponseBase } from '@interfaces/common/iresponse-api.interface';
import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import ResponseApiServiceAdapterProvider from '@providers/adapter/response-api-adapter.provider';
import { Response } from 'express';
import RequestBodyUserDto, {  } from './dto/request-body-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController extends ResponseApiServiceAdapterProvider  {
  constructor(private readonly userService: UserService) {
    super();
    this.userService = userService
  }
  @Post()
  async createUser(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: RequestBodyUserDto,
    ): Promise<Response<IResponseBase>>  {
      const results = await this.userService.createUser(body);
      return this.send(res, results);
  }
}
