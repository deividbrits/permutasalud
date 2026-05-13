import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "./src/config/firebase";
import contentRoutes from "./src/routes/contentRoutes";
import permutaRoutes from "./src/routes/permutaRoutes";
import authRoutes from "./src/routes/authRoutes";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Firebase Admin is initialized via import in the header.

  // Security middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled to allow Vite in dev
    crossOriginEmbedderPolicy: false,
  }));

  const allowedOrigins = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173', 'https://permutasalud.onrender.com'];
  
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, or if origin is in the allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // If not allowed, just return false instead of throwing an error to prevent 500 crashes on static assets
      callback(null, false);
    },
    credentials: true,
  }));

  // Rate limiters
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
  app.use('/api/auth/forgot-password', authLimiter);
  app.use('/api/auth/social-login', authLimiter);

  // Body limit to prevent DoS
  app.use(express.json({ limit: '1mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "PermutaSalud API is running" });
  });

  app.use("/api/content", contentRoutes);
  app.use("/api/permutas", permutaRoutes);
  app.use("/api/auth", authRoutes);

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
