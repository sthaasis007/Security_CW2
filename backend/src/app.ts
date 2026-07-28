import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";
import authRoutes from "./modules/auth/auth.route";
import adminRoutes from "./modules/admin/admin.route";
import productPublicRoutes from "./modules/product/product.public.route";
import favoriteRoutes from "./modules/favorite/favorite.route";
import cartRoutes from "./modules/cart/cart.route";
import activityRoutes from "./modules/activity/activity.route";
import paymentRoutes from "./modules/payment/payment.route";
import privacyRoutes from "./modules/privacy/privacy.route";
import path from "path";
import { connectDB } from "./config/db";
import { ProductModel } from "./modules/product/product.model";
import { validateSecurityConfiguration } from "./config/security";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env.local") });
validateSecurityConfiguration();

const app = express();

// Only trust the explicitly configured number of reverse proxies. Direct deployments trust none.
const trustedProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
app.set("trust proxy", Number.isInteger(trustedProxyHops) && trustedProxyHops >= 0 ? trustedProxyHops : 0);

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "no-referrer" },
}));
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  next();
});
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",").map((value) => value.trim()).filter(Boolean);
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes(origin));
  },
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

import sanitizeMiddleware from "./middleware/sanitize.middleware";
import csrfMiddleware from "./middleware/csrf.middleware";

// Sanitize all incoming requests to mitigate NoSQL injection vectors
app.use(sanitizeMiddleware);

// Apply a conservative rate limit to auth endpoints via router-level middleware later

// serve uploaded images
// Allow these static files to be fetched cross-origin (useful in dev when frontend
// may request files directly from the backend). Set Cross-Origin-Resource-Policy
// to 'cross-origin' so browsers won't block them.
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "backend", "uploads"))
);

app.get("/", (_req, res) => res.json({ message: "EverBlue API running" }));
app.get("/healthz", (_req, res) => {
  const healthy = mongoose.connection.readyState === 1;
  return res.status(healthy ? 200 : 503).json({ ok: healthy });
});

app.use("/api/auth", authRoutes);
// Apply CSRF protection to authenticated state-changing requests for API routes
app.use("/api", csrfMiddleware);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productPublicRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/privacy", privacyRoutes);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  const status = err?.status || err?.statusCode || 500;
  if (status === 413) {
    return res.status(413).json({ ok: false, message: "Request body is too large" });
  }
  if (status >= 500) {
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
  return res.status(status).json({ ok: false, message: "Request failed" });
});

const PORT = Number(process.env.BACKEND_PORT || 5000);
const MONGO_URI = (process.env.MONGO_URI || "mongodb://127.0.0.1:27017/everblue") as string;

if (MONGO_URI) {
  connectDB(MONGO_URI)
    .then(async () => {
      console.log("🔍 Checking database for seed data...");

      try {
        const prodCount = await ProductModel.countDocuments();
        if (prodCount === 0) {
          console.log("🌱 Seeding sample products...");
          await ProductModel.create([
            { name: "Sample Tee", price: 1999, description: "Comfortable cotton tee", placements: ["current"], displayOrder: 1, image: "sample-tee.jpg" },
            { name: "Blue Hoodie", price: 3999, description: "Cozy hoodie", placements: ["bestseller"], displayOrder: 2, image: "blue-hoodie.jpg" },
          ] as any);
          console.log("✅ Sample products seeded");
        }

      } catch (seedErr) {
        console.error("❌ Error during seeding:", seedErr);
      }

      app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error("❌ DB connection error:", err);
      process.exit(1);
    });
} else {
  console.warn("⚠️ MONGO_URI not configured. Starting server without a database connection.");
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}
