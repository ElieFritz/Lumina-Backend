import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber, IsEnum, IsDateString } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Adresse email' })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  email: string;

  @ApiProperty({ example: '+2250701234567', description: 'Numéro de téléphone', required: false })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Veuillez fournir un numéro de téléphone valide' })
  phone?: string;

  @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe' })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @ApiProperty({ example: 'John', description: 'Prénom' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Nom de famille' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'URL de l\'avatar', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: '1990-01-01', description: 'Date de naissance', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER, description: 'Rôle de l\'utilisateur', required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

