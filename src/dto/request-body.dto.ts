import { IsOptional } from 'class-validator';

export default abstract class RequestBodyDto {
  @IsOptional()
  status!: number;
}
