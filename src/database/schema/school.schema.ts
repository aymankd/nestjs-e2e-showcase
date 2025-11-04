import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { teachers } from './teacher.schema';

export const schools = pgTable('schools', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 500 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const schoolsRelations = relations(schools, ({ many }) => ({
  teachers: many(teachers),
}));

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;
