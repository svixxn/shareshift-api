import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      console.error('Hashing failed:', error);
      throw new InternalServerErrorException(
        'Failed to securely hash password.',
      );
    }
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Comparison failed:', error);
      return false;
    }
  }
}
