"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const admin_route_1 = __importDefault(require("./modules/admin/admin.route"));
const product_public_route_1 = __importDefault(require("./modules/product/product.public.route"));
const favorite_route_1 = __importDefault(require("./modules/favorite/favorite.route"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// serve uploaded images
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "backend", "uploads")));
app.get("/", (_req, res) => res.json({ message: "EverBlue API running" }));
app.use("/api/auth", auth_route_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/products", product_public_route_1.default);
app.use("/api/favorites", favorite_route_1.default);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
(0, db_1.connectDB)(MONGO_URI)
    .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
})
    .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
});
//# sourceMappingURL=app.js.map