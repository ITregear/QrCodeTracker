import { scannedData, type ScannedData, type InsertScannedData } from "@shared/schema";

export interface IStorage {
  getScannedData(qrId: string): Promise<ScannedData | undefined>;
  saveScannedData(data: InsertScannedData): Promise<ScannedData>;
  getAllScannedData(): Promise<ScannedData[]>;
}

export class MemStorage implements IStorage {
  private data: Map<number, ScannedData>;
  private currentId: number;

  constructor() {
    this.data = new Map();
    this.currentId = 1;
  }

  async getScannedData(qrId: string): Promise<ScannedData | undefined> {
    return Array.from(this.data.values()).find(
      (entry) => entry.qrId === qrId
    );
  }

  async saveScannedData(insertData: InsertScannedData): Promise<ScannedData> {
    const id = this.currentId++;
    const entry: ScannedData = { ...insertData, id };
    this.data.set(id, entry);
    return entry;
  }

  async getAllScannedData(): Promise<ScannedData[]> {
    return Array.from(this.data.values());
  }
}

export const storage = new MemStorage();
