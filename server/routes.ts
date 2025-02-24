import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertScannedDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/scanned/:qrId", async (req, res) => {
    const data = await storage.getScannedData(req.params.qrId);
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(data);
  });

  app.get("/api/scanned", async (_req, res) => {
    const data = await storage.getAllScannedData();
    res.json(data);
  });

  app.post("/api/scanned", async (req, res) => {
    try {
      const data = insertScannedDataSchema.parse(req.body);
      const saved = await storage.saveScannedData(data);
      res.status(201).json(saved);
    } catch (error) {
      res.status(400).json({ message: "Invalid data format" });
    }
  });

  return createServer(app);
}
