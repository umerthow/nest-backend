import { Injectable } from '@nestjs/common';
import RequestBodyUserDto from './dto/request-body-user.dto';

@Injectable()
export class UserService {
  async createUser(body: RequestBodyUserDto) {
    const { owner, name, company } = body

    return {
      owner,
      name,
      company
    }
  }
}
