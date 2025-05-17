import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wallets table
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  publicKey: text("public_key").notNull(),
  encryptedPrivateKey: text("encrypted_private_key").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  pin: text("pin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tokens table
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull().unique(),
  supply: integer("supply").notNull(),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Token balances table
export const tokenBalances = pgTable("token_balances", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  tokenId: integer("token_id").notNull().references(() => tokens.id),
  balance: integer("balance").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'send', 'receive', 'mint', 'nft'
  amount: integer("amount").notNull(),
  tokenId: integer("token_id").notNull().references(() => tokens.id),
  fromWalletId: integer("from_wallet_id").references(() => wallets.id),
  toWalletId: integer("to_wallet_id").references(() => wallets.id),
  txHash: text("tx_hash").notNull().unique(),
  status: text("status").notNull(), // 'pending', 'confirmed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  description: text("description"),
});

// Badges table
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  conditionsType: text("conditions_type"), // 'message_count', 'tip_amount', 'activity_days'
  conditionsThreshold: integer("conditions_threshold"),
  conditionsTokenId: integer("conditions_token_id").references(() => tokens.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wallet badges table (for tracking which wallet has which badges)
export const walletBadges = pgTable("wallet_badges", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  txHash: text("tx_hash"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true, createdAt: true });
export const insertTokenSchema = createInsertSchema(tokens).omit({ id: true, createdAt: true });
export const insertTokenBalanceSchema = createInsertSchema(tokenBalances).omit({ id: true, lastUpdated: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
export const insertWalletBadgeSchema = createInsertSchema(walletBadges).omit({ id: true, earnedAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type InsertToken = z.infer<typeof insertTokenSchema>;
export type InsertTokenBalance = z.infer<typeof insertTokenBalanceSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type InsertWalletBadge = z.infer<typeof insertWalletBadgeSchema>;

export type User = typeof users.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Token = typeof tokens.$inferSelect;
export type TokenBalance = typeof tokenBalances.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type WalletBadge = typeof walletBadges.$inferSelect;
