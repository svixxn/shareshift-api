import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dtos/register.dto';
import { HashingService } from 'src/shared/services/hashing/hashing.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashingService: HashingService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashingService.hash(registerDto.password);

    const createdUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });
    return await createdUser.save();
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user._id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async validateUser(userId: number) {
    const user = await this.userModel.findById(userId).select('-password');

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}
