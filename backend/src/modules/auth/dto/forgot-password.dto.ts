import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Adresse email' })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  email: string;
}

