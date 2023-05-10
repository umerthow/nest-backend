import {IsAlphanumeric, IsNumber, IsString } from 'class-validator';

export default class RequestBodyUserDto {
  @IsNumber()
  owner!: number;

  @IsAlphanumeric()
  company!: string;

  @IsString()
  name!: string;
}
