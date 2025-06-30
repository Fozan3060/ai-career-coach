import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
});

export const HistoryTable = pgTable('historyTable', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    recordId: varchar('recordId').notNull(),
    content: json('content'),
    userEmail: varchar('userEmail').references(() => usersTable.email),
    createdAt: varchar()
});