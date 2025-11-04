/**
 * Utility class for generating test data with better randomization and uniqueness
 */
export class TestDataGenerator {
  private static counter = 0;

  /**
   * Generate a unique counter-based ID
   */
  static getUniqueId(): number {
    return ++this.counter;
  }

  /**
   * Generate a unique timestamp-based ID
   */
  static getTimestampId(): string {
    return `${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
  }

  /**
   * Generate a random email address
   */
  static generateEmail(prefix?: string): string {
    const baseName = prefix || 'test';
    const id = this.getTimestampId();
    return `${baseName}${id}@example.com`;
  }

  /**
   * Generate a random phone number
   */
  static generatePhone(): string {
    const area = Math.floor(Math.random() * 900) + 100;
    const first = Math.floor(Math.random() * 900) + 100;
    const second = Math.floor(Math.random() * 9000) + 1000;
    return `+1${area}${first}${second}`;
  }

  /**
   * Generate a random name with optional prefix
   */
  static generateName(prefix?: string): string {
    const id = this.getUniqueId();
    return prefix ? `${prefix} ${id}` : `Test Name ${id}`;
  }

  /**
   * Generate a random address
   */
  static generateAddress(): string {
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Way', 'Cedar Blvd'];
    const street = streets[Math.floor(Math.random() * streets.length)];
    return `${streetNumber} ${street}`;
  }

  /**
   * Select a random item from an array
   */
  static randomChoice<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  /**
   * Generate a random boolean
   */
  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
