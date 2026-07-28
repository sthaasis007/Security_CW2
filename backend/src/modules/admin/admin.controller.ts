import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRepository } from "../auth/auth.repository";
import { deleteUploadFile } from "../../utils/file";
import { isPasswordStrong, isValidObjectId } from "../../utils/security";
import { clearSessionCookies } from "../../utils/cookie";
import { AuthService } from "../auth/auth.service";
import { ActivityService } from "../activity/activity.service";
import { PrivacyService } from "../privacy/privacy.service";

export const AdminController = {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body as any;
      const allowedFields = new Set(["name", "email", "password", "role"]);
      if (Object.keys(req.body || {}).some((field) => !allowedFields.has(field))) {
        return res.status(400).json({ ok: false, message: "Unsupported user fields" });
      }
      const normalizedName = typeof name === "string" ? name.trim() : "";
      const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      if (!normalizedName || normalizedName.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ ok: false, message: "Invalid name or email" });
      }
      if (typeof password !== "string" || !isPasswordStrong(password)) {
        return res.status(400).json({ ok: false, message: "Password does not meet complexity requirements" });
      }
      if (role !== undefined && role !== "user" && role !== "admin") {
        return res.status(400).json({ ok: false, message: "Invalid role" });
      }

      const existing = await AuthRepository.findByEmail(normalizedEmail);
      if (existing) return res.status(409).json({ ok: false, message: "Email exists" });

      const hashed = await bcrypt.hash(password, 12);
      const image = (req as any).file ? (req as any).file.filename : undefined;

      const user = await AuthRepository.createUser({
        name: normalizedName,
        email: normalizedEmail,
        password: hashed,
        role: role || "user",
        ...(image ? { image } : {}),
      } as any);
      void AuthService.resendVerification({ email: normalizedEmail });
      const actor = (req as any).user;
      await ActivityService.log(
        role === "admin" ? "admin_created" : "account_created_by_admin",
        "Administrator created an account",
        { targetUserId: user._id.toString(), assignedRole: role || "user" },
        actor,
        req,
      );

      return res.status(201).json({ ok: true, message: "User created", user: { id: (user as any)._id, email: (user as any).email, role: (user as any).role } });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async list(_req: Request, res: Response) {
    const users = (await (AuthRepository.findAll as any)()) ?? [];
    return res.status(200).json({ ok: true, users });
  },

  async get(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ ok: false, message: "Invalid user id" });
    }
    const user = await AuthRepository.findById(id as string);
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });
    return res.status(200).json({ ok: true, user });
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || !isValidObjectId(id)) {
        return res.status(400).json({ ok: false, message: "Invalid user id" });
      }
      const allowedFields = new Set(["name", "email", "password", "role"]);
      if (Object.keys(req.body || {}).some((field) => !allowedFields.has(field))) {
        return res.status(400).json({ ok: false, message: "Unsupported user fields" });
      }
      const body: { name?: string; email?: string; password?: string; role?: "user" | "admin"; image?: string } = {};
      if (req.body?.name !== undefined) {
        if (typeof req.body.name !== "string" || !req.body.name.trim() || req.body.name.trim().length > 80) {
          return res.status(400).json({ ok: false, message: "Invalid name" });
        }
        body.name = req.body.name.trim();
      }
      if (req.body?.email !== undefined) {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
          return res.status(400).json({ ok: false, message: "Invalid email" });
        }
        body.email = email;
      }
      if (req.body?.role !== undefined) {
        if (req.body.role !== "user" && req.body.role !== "admin") {
          return res.status(400).json({ ok: false, message: "Invalid role" });
        }
        body.role = req.body.role;
      }
      const existing = await AuthRepository.findById(id as string);
      if ((req as any).file) {
        body.image = (req as any).file.filename;
      }
      // don't allow password update here unless explicitly provided
      if (req.body?.password !== undefined) {
        if (typeof req.body.password !== "string" || !isPasswordStrong(req.body.password)) {
          return res.status(400).json({ ok: false, message: "Password does not meet complexity requirements" });
        }
        const passwordResult = await AuthService.changePassword(existing, req.body.password);
        if (!passwordResult.ok) return res.status(passwordResult.status).json(passwordResult);
      }
      delete body.password;

      const updated = await AuthRepository.updateUser(id as string, body as any);
      if (!updated) return res.status(404).json({ ok: false, message: "User not found" });
      if (req.body?.password || (body.role && body.role !== existing?.role)) {
        await AuthRepository.invalidateSessions(id);
        if ((req as any).user?.id === id) clearSessionCookies(res);
      }
      if (body.email && body.email !== existing?.email) {
        await AuthRepository.markEmailUnverified(id);
        await AuthRepository.invalidateSessions(id);
        void AuthService.resendVerification({ email: body.email });
      }
      const actor = (req as any).user;
      if (body.role && body.role !== existing?.role) {
        await ActivityService.log("role_changed", "Administrator changed an account role", {
          targetUserId: id,
          previousRole: existing?.role,
          newRole: body.role,
        }, actor, req);
      }
      await ActivityService.log("account_updated_by_admin", "Administrator updated an account", {
        targetUserId: id,
        updatedFields: Object.keys(body),
        passwordChanged: Boolean(req.body?.password),
      }, actor, req);

      if (body.image && existing?.image && existing.image !== body.image) {
        await deleteUploadFile(existing.image);
      }

      return res.status(200).json({ ok: true, user: updated });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ ok: false, message: "Invalid user id" });
    }
    const deleted = await PrivacyService.deleteAccount(id as string);
    if (!deleted) return res.status(404).json({ ok: false, message: "User not found" });

    if ((deleted as any).image) {
      await deleteUploadFile((deleted as any).image);
    }
    await ActivityService.log("account_deleted_by_admin", "Administrator deleted an account", {
      deletedRole: (deleted as any).role,
    }, (req as any).user, req);

    return res.status(200).json({ ok: true, message: "User deleted" });
  },
};

export default AdminController;
