import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from './config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get app(): AppConfig {
    return this.configService.get<AppConfig>('app')!;
  }

  get database(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>('database')!;
  }

  get nodeEnv(): string {
    return this.app.NODE_ENV;
  }

  get port(): number {
    return this.app.PORT;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  getDatabaseConnectionString(): string {
    const db = this.database;
    return `postgresql://${db.DB_USER}:${db.DB_PASSWORD}@${db.DB_HOST}:${db.DB_PORT}/${db.DB_NAME}`;
  }
}
