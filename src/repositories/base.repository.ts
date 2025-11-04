import { Inject } from '@nestjs/common';
import { Database } from '../database/connection';
import { DATABASE_CONNECTION } from '../database/database.module';

/**
 * Base repository class providing common database access patterns.
 * This abstract class can be extended by specific repositories to avoid code duplication.
 */
export abstract class BaseRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    protected readonly db: Database,
  ) {}

  /**
   * Helper method to check if a database operation affected any rows
   */
  protected wasAffected(result: { count: number }): boolean {
    return result.count > 0;
  }

  /**
   * Helper method to get the first result from a query or return null
   */
  protected getFirstOrNull<T>(results: T[]): T | null {
    return results[0] || null;
  }

  /**
   * Helper method to ensure a single result is returned (throws if not found)
   */
  protected getFirst<T>(results: T[], entityName: string, id?: number): T {
    const result = this.getFirstOrNull(results);
    if (!result) {
      const identifier = id ? ` with ID ${id}` : '';
      throw new Error(`${entityName}${identifier} not found`);
    }
    return result;
  }
}
