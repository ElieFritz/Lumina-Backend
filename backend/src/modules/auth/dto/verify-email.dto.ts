import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'abc123def456', description: 'Token de vérification email' })
  @IsString()
  token: string;
}

