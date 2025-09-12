import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthSimpleController {
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: any) {
    // Simulation d'enregistrement
    return {
      message: 'User registered successfully',
      user: {
        id: '11',
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        role: 'owner',
        isActive: true,
        isEmailVerified: false,
        isPhoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      token: 'mock-jwt-token-' + Date.now()
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    // Simulation de connexion
    if (loginDto.email === 'marie.kone@restaurant.ci' && loginDto.password === 'password123') {
      return {
        message: 'Login successful',
        user: {
          id: '11',
          firstName: 'Marie',
          lastName: 'Koné',
          email: 'marie.kone@restaurant.ci',
          role: 'owner',
          isActive: true,
          isEmailVerified: false,
          isPhoneVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    return {
      message: 'Invalid credentials',
      error: 'Unauthorized'
    };
  }

  @Get('me')
  async getProfile() {
    // Retourner les données de l'utilisateur propriétaire
    return {
      id: '11',
      email: 'marie.kone@restaurant.ci',
      firstName: 'Marie',
      lastName: 'Koné',
      role: 'owner',
      isActive: true,
      isEmailVerified: false,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return {
      message: 'Logout successful'
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    return {
      message: 'Password reset email sent'
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; password: string }) {
    return {
      message: 'Password reset successful'
    };
  }
}
