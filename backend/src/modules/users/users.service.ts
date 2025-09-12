import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../../common/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, phone, password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, ...(phone ? [{ phone }] : [])],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }
      if (existingUser.phone === phone) {
        throw new ConflictException('Un utilisateur avec ce numéro de téléphone existe déjà');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      ...userData,
      email,
      phone,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'],
    });

    return { users, total };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['venues', 'events'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check for email/phone conflicts if they're being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }
    }

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUser = await this.findByPhone(updateUserDto.phone);
      if (existingUser) {
        throw new ConflictException('Un utilisateur avec ce numéro de téléphone existe déjà');
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    await this.userRepository.update(id, { role });
    return this.findOne(id);
  }

  async updateStatus(id: string, isActive: boolean): Promise<User> {
    await this.userRepository.update(id, { isActive });
    return this.findOne(id);
  }

  async getProfile(id: string): Promise<Partial<User>> {
    const user = await this.findOne(id);
    const { password, emailVerificationToken, phoneVerificationCode, resetPasswordToken, ...profile } = user;
    return profile;
  }

  async updateProfile(id: string, updateData: Partial<UpdateUserDto>): Promise<Partial<User>> {
    const user = await this.update(id, updateData);
    const { password, emailVerificationToken, phoneVerificationCode, resetPasswordToken, ...profile } = user;
    return profile;
  }

  async getVenueOwners(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.VENUE_OWNER },
      select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt'],
    });
  }

  async getOrganizers(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.ORGANIZER },
      select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt'],
    });
  }
}

