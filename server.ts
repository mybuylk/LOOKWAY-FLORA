import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./server/routes/auth.js";
import productRoutes from "./server/routes/products.js";
import categoryRoutes from "./server/routes/categories.js";
import orderRoutes from "./server/routes/orders.js";
import cartRoutes from "./server/routes/cart.js";
import adminRoutes from "./server/routes/admin.js";
import { initializeData, performInitialization } from "./server/controllers/init.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        console.log("Connected to MongoDB Atlas");
        performInitialization().catch(err => console.error("Initialization error:", err));
      })
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MONGODB_URI not found in environment variables. Database features will be disabled.");
  }

  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/admin", adminRoutes);
  
  // Public Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const Settings = mongoose.model("Settings");
      let settings = await Settings.findOne();
      res.json(settings || {});
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/init", initializeData);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Lookway Flora API is running" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
