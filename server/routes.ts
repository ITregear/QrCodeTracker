import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertScannedDataSchema, insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/scanned/:qrId", async (req, res) => {
    const data = await storage.getScannedData(req.params.qrId);
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Get associated product data
    const product = await storage.getProduct(data.qrId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ ...data, product });
  });

  app.get("/api/scanned", async (_req, res) => {
    const scannedItems = await storage.getAllScannedData();
    const scannedWithProducts = await Promise.all(
      scannedItems.map(async (item) => {
        const product = await storage.getProduct(item.qrId);
        return { ...item, product };
      })
    );
    res.json(scannedWithProducts);
  });

  app.post("/api/scanned", async (req, res) => {
    try {
      const data = insertScannedDataSchema.parse(req.body);
      const saved = await storage.saveScannedData(data);

      // Get associated product data
      const product = await storage.getProduct(data.qrId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(201).json({ ...saved, product });
    } catch (error) {
      res.status(400).json({ message: "Invalid data format" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getAllProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const saved = await storage.saveProduct(data);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error saving product:", error);
      res.status(400).json({ message: "Invalid data format" });
    }
  });

  return createServer(app);
}