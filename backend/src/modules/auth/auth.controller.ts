import { Request, Response } from "express";
import { registerDto, loginDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository";
import { deleteUploadFile } from "../../utils/file";
import { ActivityService } from "../activity/activity.service";
import crypto from "crypto";

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
    // Set refresh token as secure httpOnly cookie for session management (backwards compatible: still return tokens in body)
    if (result.ok && result.refreshToken) {
      const secureFlag = process.env.NODE_ENV === "production";
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: secureFlag,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      if (result.csrfToken) {
        // set readable csrf cookie for double-submit pattern
        res.cookie("XSRF-TOKEN", result.csrfToken, { httpOnly: false, secure: secureFlag, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });
      }
    }
    return res.status(result.status).json(result);
  },

  async logout(req: Request, res: Response) {
    try {
      const currentUser = (req as any).user as { id?: string; sub?: string } | undefined;
      if (!currentUser?.id && !currentUser?.sub) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      const result = await AuthService.logout((currentUser.id || currentUser.sub) as string, req);
      // clear refresh token cookie on logout
      const secureFlag = process.env.NODE_ENV === 'production';
      res.clearCookie('refreshToken', { httpOnly: true, secure: secureFlag, sameSite: 'strict' });
      res.clearCookie('XSRF-TOKEN', { httpOnly: false, secure: secureFlag, sameSite: 'strict' });
      return res.status(result.status).json(result);
    } catch (err) {
      console.error('AuthController.logout error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      // read refresh token from cookie if present, otherwise fall back to body
      const cookieHeader = req.headers.cookie || "";
      const parseCookie = (header: string, name: string) => {
        if (!header) return null;
        const parts = header.split(';').map(p => p.trim());
        for (const p of parts) {
          const [k, v] = p.split('=');
          if (k === name) return decodeURIComponent(v || '');
        }
        return null;
      };
      const raw = parseCookie(cookieHeader, 'refreshToken') || (req.body && req.body.refreshToken) || null;
      const result = await AuthService.rotateRefreshToken(raw);
      if (!result.ok) {
        return res.status(result.status).json(result);
      }
      // set new refresh token in secure httpOnly cookie
      const secureFlag = process.env.NODE_ENV === 'production';
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: secureFlag, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
      if (result.csrfToken) {
        res.cookie('XSRF-TOKEN', result.csrfToken, { httpOnly: false, secure: secureFlag, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
      }
      // return access token and user
      return res.status(200).json({ ok: true, accessToken: result.accessToken, user: result.user });
    } catch (err) {
      console.error('AuthController.refreshToken error', err);
      return res.status(500).json({ ok: false, message: 'Server error' });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body as any;
      if (!name || !email || !password) {
        return res.status(400).json({ ok: false, message: "Missing fields" });
      }

      const existing = await AuthRepository.findByEmail(email);
      if (existing) return res.status(409).json({ ok: false, message: "Email exists" });

      // enforce strong password policy
      const { isPasswordStrong } = await import("./auth.service");
      if (!isPasswordStrong(password)) {
        return res.status(400).json({ ok: false, message: "Password does not meet complexity requirements" });
      }

      const hashed = await bcrypt.hash(password, 12);
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
      console.error('AuthController.createUser error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  },

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await AuthRepository.findById(id as string);
      if (!user) return res.status(404).json({ ok: false, message: "User not found" });
      return res.status(200).json({ ok: true, user });
    } catch (err) {
      console.error('AuthController.getUser error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
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
        // Prevent reuse of recent passwords
        const existingUser = await AuthRepository.findById(id as string);
        if (existingUser) {
          const history = (existingUser as any).passwordHistory || [];
          // compare new password against current and history
          const reuseChecks = [] as Promise<boolean>[];
          reuseChecks.push(bcrypt.compare(body.password, (existingUser as any).password));
          for (const h of history.slice(0, 5)) {
            if (h && h.hash) reuseChecks.push(bcrypt.compare(body.password, h.hash));
          }
          const results = await Promise.all(reuseChecks);
          if (results.some((r) => r)) {
            return res.status(400).json({ ok: false, message: "New password must not match recent passwords" });
          }
        }
        body.password = await bcrypt.hash(body.password, 12);
      }
      const updated = await AuthRepository.updateUser(id as string, body as any);
      if (!updated) return res.status(404).json({ ok: false, message: "User not found" });

      await ActivityService.log(
        "profile_update",
        "User profile updated",
        { updatedFields: Object.keys(body) },
        {
          id: updated._id?.toString() || null,
          email: updated.email || null,
          username: updated.name || null,
          role: updated.role || null,
        },
        req
      );

      if (body.image && existing?.image && existing.image !== body.image) {
        await deleteUploadFile(existing.image);
      }

      return res.status(200).json({ ok: true, user: updated });
    } catch (err) {
      console.error('AuthController.updateUser error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
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
      console.error('AuthController.deleteUser error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  },
};
