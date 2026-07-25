import { Request, Response } from "express";
import { registerDto, loginDto, forgotPasswordDto, resetPasswordDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository";
import { deleteUploadFile } from "../../utils/file";

export const AuthController = {
  async register(req: Request, res: Response) {
    const parsed = registerDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await AuthService.register(parsed.data);
    return res.status(result.status).json(result);
  },

  async login(req: Request, res: Response) {
    const parsed = loginDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await AuthService.login(parsed.data);
    return res.status(result.status).json(result);
  },

  async forgotPassword(req: Request, res: Response) {
    const parsed = forgotPasswordDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await AuthService.requestPasswordReset(parsed.data);
    return res.status(result.status).json(result);
  },

  async resetPassword(req: Request, res: Response) {
    const parsed = resetPasswordDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await AuthService.resetPassword(parsed.data);
    return res.status(result.status).json(result);
  },

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body as any;
      if (!name || !email || !password) {
        return res.status(400).json({ ok: false, message: "Missing fields" });
      }

      const existing = await AuthRepository.findByEmail(email);
      if (existing) return res.status(409).json({ ok: false, message: "Email exists" });

      const hashed = await bcrypt.hash(password, 10);
      const image = (req as any).file ? (req as any).file.filename : undefined;

      const user = await AuthRepository.createUser({
        name,
        email,
        password: hashed,
        role: role || "user",
        ...(image ? { image } : {}),
      } as any);

      return res.status(201).json({ ok: true, message: "User created", user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await AuthRepository.findById(id as string);
      if (!user) return res.status(404).json({ ok: false, message: "User not found" });
      return res.status(200).json({ ok: true, user });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as any;
      const existing = await AuthRepository.findById(id as string);
      if ((req as any).file) {
        body.image = (req as any).file.filename;
      }
      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }
      const updated = await AuthRepository.updateUser(id as string, body as any);
      if (!updated) return res.status(404).json({ ok: false, message: "User not found" });

      if (body.image && existing?.image && existing.image !== body.image) {
        await deleteUploadFile(existing.image);
      }

      return res.status(200).json({ ok: true, user: updated });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = (req as any).user as { sub?: string; role?: string } | undefined;

      if (!currentUser?.sub) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      if (currentUser.role !== "admin" && currentUser.sub !== id) {
        return res.status(403).json({ ok: false, message: "Forbidden" });
      }

      const deleted = await AuthRepository.deleteUser(id as string);
      if (!deleted) return res.status(404).json({ ok: false, message: "User not found" });

      if ((deleted as any).image) {
        await deleteUploadFile((deleted as any).image);
      }

      return res.status(200).json({ ok: true, message: "User deleted" });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },
};
