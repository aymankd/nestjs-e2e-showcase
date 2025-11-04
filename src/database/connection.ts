import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';
import { AppConfigService } from '../config/app-config.service';

export const createDatabaseConnection = (configService: AppConfigService) => {
  const connectionString = configService.getDatabaseConnectionString();

  const queryClient = postgres(connectionString);
  return drizzle(queryClient, { schema });
};
export type Database = ReturnType<typeof createDatabaseConnection>;
