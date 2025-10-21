import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
});

export type Env = z.infer<typeof EnvSchema>;

export const validate = (config: Record<string, unknown>): Env => {
  try {
    return EnvSchema.parse(config);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Environment variable validation failed');
  }
};
