import { pgTable, text, serial, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  specs: jsonb("specs").notNull(),
});

export const scannedData = pgTable("scanned_data", {
  id: serial("id").primaryKey(),
  qrId: text("qr_id").notNull(),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
});

// Product schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertScannedDataSchema = createInsertSchema(scannedData).omit({
  id: true,
});

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ScannedData = typeof scannedData.$inferSelect;
export type InsertScannedData = z.infer<typeof insertScannedDataSchema>;