import { pgTable, text, timestamp, boolean, serial, integer, decimal, jsonb, unique } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- Bolão System Tables ---------------------------------------------------

export const competitions = pgTable('competitions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull().default('league'),
  status: text('status').notNull().default('draft'),
  entryFee: decimal('entryFee', { precision: 10, scale: 2 }).default('0'),
  prizePool: decimal('prizePool', { precision: 10, scale: 2 }).default('0'),
  rules: jsonb('rules'),
  inviteCode: text('inviteCode').unique(),
  isPublic: boolean('isPublic').default(false),
  maxParticipants: integer('maxParticipants'),
  startDate: timestamp('startDate'),
  endDate: timestamp('endDate'),
  createdBy: text('createdBy').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const competitionParticipants = pgTable('competition_participants', {
  id: serial('id').primaryKey(),
  competitionId: integer('competitionId').notNull(),
  userId: text('userId').notNull(),
  role: text('role').notNull().default('participant'),
  status: text('status').notNull().default('active'),
  totalPoints: integer('totalPoints').default(0),
  exactScores: integer('exactScores').default(0),
  correctResults: integer('correctResults').default(0),
  joinedAt: timestamp('joinedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => [
  unique().on(table.competitionId, table.userId)
])

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  shortName: text('shortName'),
  logo: text('logo'),
  country: text('country'),
  league: text('league'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  competitionId: integer('competitionId').notNull(),
  homeTeamId: integer('homeTeamId').notNull(),
  awayTeamId: integer('awayTeamId').notNull(),
  round: text('round'),
  matchDate: timestamp('matchDate').notNull(),
  venue: text('venue'),
  status: text('status').notNull().default('scheduled'),
  homeScore: integer('homeScore'),
  awayScore: integer('awayScore'),
  isLocked: boolean('isLocked').default(false),
  lockTime: timestamp('lockTime'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const bets = pgTable('bets', {
  id: serial('id').primaryKey(),
  matchId: integer('matchId').notNull(),
  participantId: integer('participantId').notNull(),
  userId: text('userId').notNull(),
  homeScore: integer('homeScore').notNull(),
  awayScore: integer('awayScore').notNull(),
  points: integer('points').default(0),
  isProcessed: boolean('isProcessed').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => [
  unique().on(table.matchId, table.participantId)
])

export const scoringRules = pgTable('scoring_rules', {
  id: serial('id').primaryKey(),
  competitionId: integer('competitionId').notNull(),
  exactScore: integer('exactScore').notNull().default(10),
  correctResult: integer('correctResult').notNull().default(5),
  correctGoalDiff: integer('correctGoalDiff').notNull().default(3),
  correctHomeGoals: integer('correctHomeGoals').notNull().default(1),
  correctAwayGoals: integer('correctAwayGoals').notNull().default(1),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Types
export type User = typeof user.$inferSelect
export type Competition = typeof competitions.$inferSelect
export type CompetitionParticipant = typeof competitionParticipants.$inferSelect
export type Team = typeof teams.$inferSelect
export type Match = typeof matches.$inferSelect
export type Bet = typeof bets.$inferSelect
export type ScoringRule = typeof scoringRules.$inferSelect
