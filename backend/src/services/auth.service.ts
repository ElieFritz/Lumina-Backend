import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService, CreateUserDto } from './user.service';
import { User } from '../entities/user.entity';
import { jwtConfig } from '../config/database.config';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Partial<User>;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      const user = await this.userService.create(createUserDto);
      const token = this.generateToken(user);
      
      return {
        user: this.sanitizeUser(user),
        token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erreur lors de la création de l\'utilisateur');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.validatePassword(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Compte inactif');
    }

    const token = this.generateToken(user);
    
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getProfile(userId: number): Promise<Partial<User>> {
    const user = await this.userService.findOne(userId);
    return this.sanitizeUser(user);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    // TODO: Générer un token de réinitialisation et envoyer un email
    const resetToken = this.generateResetToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 heure
    
    await this.userService.update(user.id, {
      // Le token sera sauvegardé via une méthode spécifique
    });

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // TODO: Implémenter la logique de réinitialisation
    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.expiresIn,
    });
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, passwordResetToken, passwordResetExpires, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, { secret: jwtConfig.secret });
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
