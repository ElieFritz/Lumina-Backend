import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPhoneNumber } from 'class-validator';

export class VerifyPhoneDto {
  @ApiProperty({ example: '+2250701234567', description: 'Numéro de téléphone' })
  @IsPhoneNumber(null, { message: 'Veuillez fournir un numéro de téléphone valide' })
  phone: string;

  @ApiProperty({ example: '123456', description: 'Code de vérification SMS' })
  @IsString()
  code: string;
}

