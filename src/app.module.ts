import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/envs.schema';
import { UsersModule } from './models/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HashingService } from './shared/services/hashing/hashing.service';
import { HashingModule } from './shared/services/hashing/hashing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HashingModule,
  ],
  controllers: [AppController],
  providers: [AppService, HashingService],
})
export class AppModule {}
