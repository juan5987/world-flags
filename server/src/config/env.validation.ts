import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

class EnvConfig {
  @IsString()
  DATABASE_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  GOOGLE_CLIENT_ID!: string;

  @IsNumber()
  PORT!: number;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors
        .map((e) => e.toString())
        .join('\n')}`,
    );
  }
  return validated;
}

export default validate;