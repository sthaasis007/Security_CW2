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
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const product_model_1 = require("./modules/product/product.model");
const user_model_1 = require("./modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), "..", ".env.local") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const app = (0, express_1.default)();
// Trust proxy to get real client IP
app.set("trust proxy", 1);
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
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express_1.default.json({ limit: "100kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "100kb" }));
const sanitize_middleware_1 = __importDefault(require("./middleware/sanitize.middleware"));
const rateLimit_middleware_1 = __importDefault(require("./middleware/rateLimit.middleware"));
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
// Apply auth-specific rate limiting: max 6 requests per 15 minutes for sensitive endpoints
const authRateLimiter = (0, rateLimit_middleware_1.default)({ windowMs: 15 * 60 * 1000, max: 6, keyPrefix: "auth" });
app.use("/api/auth", authRateLimiter, auth_route_1.default);
// Apply CSRF protection to authenticated state-changing requests for API routes
app.use("/api", csrf_middleware_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/products", product_public_route_1.default);
app.use("/api/favorites", favorite_route_1.default);
app.use("/api/cart", cart_route_1.default);
app.use("/api/activity", activity_route_1.default);
app.use("/api/payment", payment_route_1.default);
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    const status = err?.status || err?.statusCode || 500;
    if (status >= 500) {
        return res.status(500).json({ ok: false, message: "Internal server error" });
    }
    return res.status(status).json({ ok: false, message: err?.message || "Request failed" });
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
            const adminExists = await user_model_1.UserModel.findOne({ role: "admin" });
            if (!adminExists) {
                console.log("🌱 Creating default admin user (email: admin@local.com, password: Admin123!)...");
                const hashed = await bcryptjs_1.default.hash("Admin123!", 12);
                await user_model_1.UserModel.create({ name: "Admin", email: "admin@local.com", password: hashed, role: "admin", passwordHistory: [{ hash: hashed, changedAt: new Date() }] });
                console.log("✅ Admin user created");
            }
            else {
                // If an admin exists but has an invalid email like 'admin@local', update it to a valid address
                if (!adminExists.email.includes('.')) {
                    console.log("🔧 Updating existing admin email to admin@local.com for compatibility...");
                    await user_model_1.UserModel.findByIdAndUpdate(adminExists._id, { email: 'admin@local.com' });
                    console.log("✅ Admin email updated");
                }
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