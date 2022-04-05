import { DesafioStatus } from '../desafio-status.emum';
import { IsOptional } from 'class-validator';

export class AtualizarDesafioDto {
  @IsOptional()
  status: DesafioStatus;
}
