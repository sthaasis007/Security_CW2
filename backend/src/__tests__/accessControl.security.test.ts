import jwt from "jsonwebtoken";
import express from "express";
import request from "supertest";
import { Types } from "mongoose";
import { authOnly } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthRepository } from "../modules/auth/auth.repository";
import { registerDto } from "../modules/auth/auth.dto";
import { getJwtSecret } from "../config/security";
import authRoutes from "../modules/auth/auth.route";

jest.mock("../modules/auth/auth.repository", () => ({
  AuthRepository: {
    findById: jest.fn(),
  },
}));

const mockResponse = () =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }) as any;

describe("Phase 1 access-control regression tests", () => {
  const originalSecret = process.env.JWT_SECRET;
  const secureTestSecret = "test-only-jwt-secret-that-is-longer-than-32-characters";

  beforeEach(() => {
    process.env.JWT_SECRET = secureTestSecret;
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it("rejects role injection during public registration validation", () => {
    const result = registerDto.safeParse({
      name: "User",
      email: "user@example.com",
      password: "StrongPassword!123",
      role: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("does not expose the former unauthenticated account-creation route", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);

    const response = await request(app)
      .post("/api/auth/user")
      .send({
        name: "Attacker",
        email: "attacker@example.com",
        password: "StrongPassword!123",
        role: "admin",
      });

    expect(response.status).toBe(404);
    expect(AuthRepository.findById).not.toHaveBeenCalled();
  });

  it("rejects profile mass assignment before updating the database", async () => {
    const req = {
      params: { id: new Types.ObjectId().toString() },
      body: { name: "User", role: "admin" },
    } as any;
    const res = mockResponse();

    await AuthController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(AuthRepository.findById).not.toHaveBeenCalled();
  });

  it("uses the database role instead of an elevated JWT role", async () => {
    const userId = new Types.ObjectId().toString();
    const token = jwt.sign({ sub: userId, role: "admin" }, secureTestSecret);
    (AuthRepository.findById as jest.Mock).mockResolvedValue({
      _id: userId,
      name: "User",
      email: "user@example.com",
      role: "user",
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = mockResponse();
    const next = jest.fn();

    await authOnly(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user.role).toBe("user");
  });

  it("denies admin access when only the JWT claims administrator privileges", async () => {
    const userId = new Types.ObjectId().toString();
    const token = jwt.sign({ sub: userId, role: "admin" }, secureTestSecret);
    (AuthRepository.findById as jest.Mock).mockResolvedValue({
      _id: userId,
      email: "user@example.com",
      role: "user",
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = mockResponse();
    const next = jest.fn();

    await adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a valid old token after its user has been deleted", async () => {
    const userId = new Types.ObjectId().toString();
    const token = jwt.sign({ sub: userId, role: "user" }, secureTestSecret);
    (AuthRepository.findById as jest.Mock).mockResolvedValue(null);
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = mockResponse();
    const next = jest.fn();

    await authOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("refuses missing, short and known placeholder JWT secrets", () => {
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow();
    process.env.JWT_SECRET = "short";
    expect(() => getJwtSecret()).toThrow();
    process.env.JWT_SECRET = "change_me_local_secret";
    expect(() => getJwtSecret()).toThrow();
  });
});
