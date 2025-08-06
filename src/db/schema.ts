import { integer, json, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique()
})

export const HistoryTable = pgTable('historyTable', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  recordId: varchar('recordId').notNull(),
  content: json('content'),
  userEmail: varchar('userEmail').references(() => usersTable.email),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  aiAgentType: varchar('aiAgentType'),
  metaData: varchar()
})

export const UserUsageTable = pgTable('userUsage', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
  AgentType: varchar('AgentType').notNull(), // 'resume-analyzer', 'roadmap-generator', 'cover-letter-generator'
  usageCount: integer('usageCount').default(0).notNull(),

})