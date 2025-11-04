import { Global, Module } from '@nestjs/common';
import { createDatabaseConnection, Database } from './connection';
import { AppConfigService } from '../config/app-config.service';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Global()
@Module({
  providers: [
    AppConfigService,
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: AppConfigService): Database => {
        return createDatabaseConnection(configService);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION, AppConfigService],
})
export class DatabaseModule {}
