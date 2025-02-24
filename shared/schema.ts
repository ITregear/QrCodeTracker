import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scannedData = pgTable("scanned_data", {
  id: serial("id").primaryKey(),
  qrId: text("qr_id").notNull(),
  data: jsonb("data").notNull(),
  scannedAt: text("scanned_at").notNull(),
});

export const insertScannedDataSchema = createInsertSchema(scannedData).omit({
  id: true,
});

export type InsertScannedData = z.infer<typeof insertScannedDataSchema>;
export type ScannedData = typeof scannedData.$inferSelect;
