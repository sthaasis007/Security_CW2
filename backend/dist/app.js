"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const admin_route_1 = __importDefault(require("./modules/admin/admin.route"));
const product_public_route_1 = __importDefault(require("./modules/product/product.public.route"));
const favorite_route_1 = __importDefault(require("./modules/favorite/favorite.route"));
const cart_route_1 = __importDefault(require("./modules/cart/cart.route"));
const activity_route_1 = __importDefault(require("./modules/activity/activity.route"));
const payment_route_1 = __importDefault(require("./modules/payment/payment.route"));
const privacy_route_1 = __importDefault(require("./modules/privacy/privacy.route"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const product_model_1 = require("./modules/product/product.model");
const security_1 = require("./config/security");
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), "..", ".env.local") });
(0, security_1.validateSecurityConfiguration)();
const app = (0, express_1.default)();
// Only trust the explicitly configured number of reverse proxies. Direct deployments trust none.
const trustedProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
app.set("trust proxy", Number.isInteger(trustedProxyHops) && trustedProxyHops >= 0 ? trustedProxyHops : 0);
app.disable("x-powered-by");
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)({
    credentials: true,
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.includes(origin));
    },
}));
app.use(express_1.default.json({ limit: "100kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "100kb" }));
const sanitize_middleware_1 = __importDefault(require("./middleware/sanitize.middleware"));
const csrf_middleware_1 = __importDefault(require("./middleware/csrf.middleware"));
// Sanitize all incoming requests to mitigate NoSQL injection vectors
app.use(sanitize_middleware_1.default);
// Apply a conservative rate limit to auth endpoints via router-level middleware later
// serve uploaded images
// Allow these static files to be fetched cross-origin (useful in dev when frontend
// may request files directly from the backend). Set Cross-Origin-Resource-Policy
// to 'cross-origin' so browsers won't block them.
app.use("/uploads", (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express_1.default.static(path_1.default.join(process.cwd(), "backend", "uploads")));
app.get("/", (_req, res) => res.json({ message: "EverBlue API running" }));
app.use("/api/auth", auth_route_1.default);
// Apply CSRF protection to authenticated state-changing requests for API routes
app.use("/api", csrf_middleware_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/products", product_public_route_1.default);
app.use("/api/favorites", favorite_route_1.default);
app.use("/api/cart", cart_route_1.default);
app.use("/api/activity", activity_route_1.default);
app.use("/api/payment", payment_route_1.default);
app.use("/api/privacy", privacy_route_1.default);
app.use((err, _req, res, _next) => {
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
const MONGO_URI = (process.env.MONGO_URI || "mongodb://127.0.0.1:27017/everblue");
if (MONGO_URI) {
    (0, db_1.connectDB)(MONGO_URI)
        .then(async () => {
        console.log("🔍 Checking database for seed data...");
        try {
            const prodCount = await product_model_1.ProductModel.countDocuments();
            if (prodCount === 0) {
                console.log("🌱 Seeding sample products...");
                await product_model_1.ProductModel.create([
                    { name: "Sample Tee", price: 1999, description: "Comfortable cotton tee", placements: ["current"], displayOrder: 1, image: "sample-tee.jpg" },
                    { name: "Blue Hoodie", price: 3999, description: "Cozy hoodie", placements: ["bestseller"], displayOrder: 2, image: "blue-hoodie.jpg" },
                ]);
                console.log("✅ Sample products seeded");
            }
        }
        catch (seedErr) {
            console.error("❌ Error during seeding:", seedErr);
        }
        app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
    })
        .catch((err) => {
        console.error("❌ DB connection error:", err);
        process.exit(1);
    });
}
else {
    console.warn("⚠️ MONGO_URI not configured. Starting server without a database connection.");
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}
//# sourceMappingURL=app.js.map