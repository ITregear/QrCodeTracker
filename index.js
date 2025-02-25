var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertProductSchema: () => insertProductSchema,
  insertScannedDataSchema: () => insertScannedDataSchema,
  products: () => products,
  scannedData: () => scannedData
});
import { pgTable, text, serial, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  specs: jsonb("specs").notNull()
});
var scannedData = pgTable("scanned_data", {
  id: serial("id").primaryKey(),
  qrId: text("qr_id").notNull(),
  scannedAt: timestamp("scanned_at").notNull().defaultNow()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});
var insertScannedDataSchema = createInsertSchema(scannedData).omit({ id: true }).extend({
  scannedAt: z.coerce.date()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getScannedData(qrId) {
    const [data] = await db.select().from(scannedData).where(eq(scannedData.qrId, qrId));
    return data;
  }
  async saveScannedData(insertData) {
    const [data] = await db.insert(scannedData).values(insertData).returning();
    return data;
  }
  async getAllScannedData() {
    return await db.select().from(scannedData);
  }
  async getProduct(productId) {
    const [product] = await db.select().from(products).where(eq(products.productId, productId));
    return product;
  }
  async getAllProducts() {
    return await db.select().from(products);
  }
  async saveProduct(product) {
    const [saved] = await db.insert(products).values(product).returning();
    return saved;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/scanned/:qrId", async (req, res) => {
    const data = await storage.getScannedData(req.params.qrId);
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    const product = await storage.getProduct(data.qrId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ ...data, product });
  });
  app2.get("/api/scanned", async (_req, res) => {
    const scannedItems = await storage.getAllScannedData();
    const scannedWithProducts = await Promise.all(
      scannedItems.map(async (item) => {
        const product = await storage.getProduct(item.qrId);
        return { ...item, product };
      })
    );
    res.json(scannedWithProducts);
  });
  app2.post("/api/scanned", async (req, res) => {
    try {
      const data = insertScannedDataSchema.parse(req.body);
      const saved = await storage.saveScannedData(data);
      const product = await storage.getProduct(data.qrId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(201).json({ ...saved, product });
    } catch (error) {
      res.status(400).json({ message: "Invalid data format" });
    }
  });
  app2.get("/api/products", async (_req, res) => {
    const products2 = await storage.getAllProducts();
    res.json(products2);
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const saved = await storage.saveProduct(data);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error saving product:", error);
      res.status(400).json({ message: "Invalid data format" });
    }
  });
  return createServer(app2);
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  base: "/QrCodeTracker/"
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
