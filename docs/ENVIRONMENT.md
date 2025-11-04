# Environment Configuration

This application uses comprehensive environment variable validation using `@nestjs/config` and `joi`.

## Required Environment Variables

The following environment variables are required and will be validated at application startup:

### Database Configuration
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database username (required)
- `DB_PASSWORD` - Database password (required)
- `DB_NAME` - Database name (required)

### Application Configuration
- `NODE_ENV` - Application environment (development, production, test) (default: development)
- `PORT` - Application port (default: 3000)

## Environment Files

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` according to your environment.

## Validation Features

- **Type Validation**: Ensures proper data types (numbers, strings, etc.)
- **Required Fields**: Validates that required fields are present and not empty
- **Custom Messages**: Provides clear error messages for validation failures
- **Default Values**: Applies sensible defaults where appropriate
- **Hostname Validation**: Validates database host format
- **Port Validation**: Ensures port numbers are valid

## Configuration Service

The application provides a typed configuration service (`AppConfigService`) that offers:

- Type-safe access to configuration values
- Convenience methods for environment checking
- Database connection string generation
- Easy access to grouped configuration (app, database)

### Usage Example

```typescript
import { AppConfigService } from './config/app-config.service';

@Injectable()
export class SomeService {
  constructor(private configService: AppConfigService) {}

  someMethod() {
    // Check environment
    if (this.configService.isDevelopment) {
      // Development-specific logic
    }

    // Get database config
    const dbConfig = this.configService.database;
    
    // Get connection string
    const connectionString = this.configService.getDatabaseConnectionString();
  }
}
```

## Error Handling

If environment validation fails, the application will:
1. Log detailed error messages showing which variables are invalid
2. Prevent application startup
3. Exit with a non-zero status code

This ensures that the application never runs with invalid configuration.