"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const auth_repository_1 = require("../modules/auth/auth.repository");
const security_1 = require("../utils/security");
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const run = async () => {
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
    const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Administrator";
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || !email || !password) {
        throw new Error("MONGO_URI, BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !(0, security_1.isPasswordStrong)(password)) {
        throw new Error("Bootstrap administrator email or password does not meet security requirements");
    }
    await (0, db_1.connectDB)(mongoUri);
    const existing = await auth_repository_1.AuthRepository.findByEmail(email);
    if (existing) {
        throw new Error("A user with the bootstrap email already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    await auth_repository_1.AuthRepository.createUser({
        name,
        email,
        password: hashedPassword,
        role: "admin",
    });
    console.log(`Administrator created for ${email}`);
};
run()
    .catch((error) => {
    console.error(error instanceof Error ? error.message : "Administrator bootstrap failed");
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.disconnect();
});
//# sourceMappingURL=bootstrap-admin.js.map