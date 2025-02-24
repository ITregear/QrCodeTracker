import { products, scannedData, type Product, type ScannedData, type InsertScannedData, type InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getScannedData(qrId: string): Promise<ScannedData | undefined>;
  saveScannedData(data: InsertScannedData): Promise<ScannedData>;
  getAllScannedData(): Promise<ScannedData[]>;
  getProduct(productId: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  saveProduct(product: InsertProduct): Promise<Product>;
}

export class DatabaseStorage implements IStorage {
  async getScannedData(qrId: string): Promise<ScannedData | undefined> {
    const [data] = await db.select().from(scannedData).where(eq(scannedData.qrId, qrId));
    return data;
  }

  async saveScannedData(insertData: InsertScannedData): Promise<ScannedData> {
    const [data] = await db.insert(scannedData).values(insertData).returning();
    return data;
  }

  async getAllScannedData(): Promise<ScannedData[]> {
    return await db.select().from(scannedData);
  }

  async getProduct(productId: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.productId, productId));
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async saveProduct(product: InsertProduct): Promise<Product> {
    const [saved] = await db.insert(products).values(product).returning();
    return saved;
  }
}

export const storage = new DatabaseStorage();