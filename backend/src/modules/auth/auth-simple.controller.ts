import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthSimpleController {
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      // Simulation d'authentification simple
      if (loginDto.email === 'test@example.com' && loginDto.password === 'password123') {
        return {
          success: true,
          message: 'Connexion réussie',
          user: {
            id: 1,
            email: loginDto.email,
            firstName: 'Test',
            lastName: 'User',
            role: 'user'
          },
          token: 'fake-jwt-token-' + Date.now()
        };
      } else {
        throw new HttpException('Identifiants invalides', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException('Erreur de connexion', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register')
  async register(@Body() registerDto: { email: string; password: string; firstName: string; lastName: string }) {
    try {
      // Simulation d'inscription simple
      return {
        success: true,
        message: 'Inscription réussie',
        user: {
          id: Date.now(),
          email: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: 'user'
        },
        token: 'fake-jwt-token-' + Date.now()
      };
    } catch (error) {
      throw new HttpException('Erreur d\'inscription', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyDto: { token: string }) {
    return {
      success: true,
      message: 'Email vérifié avec succès'
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotDto: { email: string }) {
    return {
      success: true,
      message: 'Email de réinitialisation envoyé'
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: { token: string; password: string }) {
    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    };
  }
}
