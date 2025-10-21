import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from 'src/config/database/constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    inject: [ConfigService],
    useFactory: (config: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(config.get('DATABASE_URL')!),
  },
];
