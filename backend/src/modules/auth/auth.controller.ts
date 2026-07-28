import { Request, Response } from "express";
import { registerDto, loginDto, forgotPasswordDto, resetPasswordDto, tokenDto, mfaDisableDto, mfaVerifyDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { deleteUploadFile } from "../../utils/file";
import { ActivityService } from "../activity/activity.service";
import { isPasswordStrong, isValidObjectId } from "../../utils/security";
import { clearSessionCookies, readCookie, REFRESH_COOKIE, setSessionCookies } from "../../utils/cookie";
import { PrivacyService } from "../privacy/privacy.service";

export const AuthController = {
  async register(req: Request, res: Response) {
    const parsed = registerDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { confirmPassword, ...safeData } = parsed.data;
    if (confirmPassword !== undefined && confirmPassword !== safeData.password) {
      return res.status(400).json({ ok: false, message: "Passwords do not match" });
    }

    const result = await AuthService.register(safeData);
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

    const result: any = await AuthService.login(parsed.data);
    if ((result as any).mfaRequired) {
      return res.status(result.status).json({
        ok: true,
        mfaRequired: true,
        challengeToken: (result as any).challengeToken,
        message: result.message,
      });
    }
    if (result.ok && result.accessToken && result.refreshToken && result.csrfToken) {
      if (!result.accessToken || !result.refreshToken || !result.csrfToken) {
        clearSessionCookies(res);
        return res.status(500).json({ ok: false, message: "Session creation failed" });
      }
      setSessionCookies(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        csrfToken: result.csrfToken,
      });
    }
    return res.status(result.status).json({
      ok: result.ok,
      message: result.message,
      code: (result as any).code,
      user: result.user,
    });
  },

  async forgotPassword(req: Request, res: Response) {
    const parsed = forgotPasswordDto.safeParse(req.body);
    if (!parsed.success) return res.status(202).json({ ok: true, message: "If the address is eligible, an email will be sent shortly." });
    const result = await AuthService.forgotPassword(parsed.data);
    return res.status(result.status).json(result);
  },

  async resetPassword(req: Request, res: Response) {
    const parsed = resetPasswordDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, message: "Invalid reset request" });
    const result = await AuthService.resetPassword(parsed.data);
    if (result.ok) clearSessionCookies(res);
    return res.status(result.status).json(result);
  },

  async verifyEmail(req: Request, res: Response) {
    const parsed = tokenDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, message: "Invalid verification link" });
    const result = await AuthService.verifyEmail(parsed.data.token);
    return res.status(result.status).json(result);
  },

  async resendVerification(req: Request, res: Response) {
    const parsed = forgotPasswordDto.safeParse(req.body);
    if (!parsed.success) return res.status(202).json({ ok: true, message: "If the address is eligible, an email will be sent shortly." });
    const result = await AuthService.resendVerification(parsed.data);
    return res.status(result.status).json(result);
  },

  async logout(req: Request, res: Response) {
    try {
      const currentUser = (req as any).user as { id?: string; sub?: string } | undefined;
      if (!currentUser?.id && !currentUser?.sub) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      const result = await AuthService.logout((currentUser.id || currentUser.sub) as string, req);
      clearSessionCookies(res);
      return res.status(result.status).json(result);
    } catch (err) {
      console.error('AuthController.logout error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const raw = readCookie(req, REFRESH_COOKIE);
      const result = await AuthService.rotateRefreshToken(raw);
      if (!result.ok) {
        clearSessionCookies(res);
        return res.status(result.status).json(result);
      }
      if (!result.accessToken || !result.refreshToken || !result.csrfToken) {
        clearSessionCookies(res);
        return res.status(500).json({ ok: false, message: "Session creation failed" });
      }
      setSessionCookies(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        csrfToken: result.csrfToken,
      });
      return res.status(200).json({ ok: true, user: result.user });
    } catch (err) {
      console.error('AuthController.refreshToken error', err);
      return res.status(500).json({ ok: false, message: 'Server error' });
    }
  },

  async verifyLoginMfa(req: Request, res: Response) {
    const parsed = mfaVerifyDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, message: "Invalid MFA request" });
    const result: any = await AuthService.verifyLoginMfa(parsed.data.challengeToken, parsed.data.code);
    if (!result.ok || !result.accessToken || !result.refreshToken || !result.csrfToken) {
      return res.status(result.status).json({ ok: false, message: result.message });
    }
    setSessionCookies(res, result);
    return res.status(200).json({ ok: true, message: result.message, user: result.user });
  },

  async beginMfaSetup(req: Request, res: Response) {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    const result = await AuthService.beginMfaSetup(userId);
    return res.status(result.status).json(result);
  },

  async confirmMfaSetup(req: Request, res: Response) {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    const parsed = mfaVerifyDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, message: "Invalid MFA request" });
    const result = await AuthService.confirmMfaSetup(userId, parsed.data.challengeToken, parsed.data.code);
    return res.status(result.status).json(result);
  },

  async disableMfa(req: Request, res: Response) {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    const parsed = mfaDisableDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, message: "Password is required" });
    const result = await AuthService.disableMfa(userId, parsed.data.password);
    if (result.ok) clearSessionCookies(res);
    return res.status(result.status).json(result);
  },

  async session(req: Request, res: Response) {
    res.setHeader("Cache-Control", "no-store");
    const currentUser = (req as any).user;
    return res.status(200).json({
      ok: true,
      user: {
        id: currentUser.id,
        name: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
      },
    });
  },

  async logoutAll(req: Request, res: Response) {
    const currentUser = (req as any).user as { id?: string; sub?: string };
    const userId = currentUser.id || currentUser.sub;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    await AuthRepository.invalidateSessions(userId);
    clearSessionCookies(res);
    return res.status(200).json({ ok: true, message: "All sessions invalidated" });
  },

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ ok: false, message: "Invalid user id" });
      }

      const user = await AuthRepository.findById(id as string);
      if (!user) return res.status(404).json({ ok: false, message: "User not found" });

      const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        mfaEnabled: Boolean((user as any).mfaEnabled),
      };

      return res.status(200).json({ ok: true, user: safeUser });
    } catch (err) {
      console.error('AuthController.getUser error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string" || !isValidObjectId(id)) {
        return res.status(400).json({ ok: false, message: "Invalid user id" });
      }

      const submittedFields = Object.keys(req.body || {});
      const allowedFields = new Set(["name", "email", "password"]);
      if (submittedFields.some((field) => !allowedFields.has(field))) {
        return res.status(400).json({ ok: false, message: "Unsupported profile fields" });
      }

      const body: { name?: string; email?: string; password?: string; image?: string } = {};
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
      if (req.body?.password !== undefined) {
        if (typeof req.body.password !== "string") {
          return res.status(400).json({ ok: false, message: "Invalid password" });
        }
        body.password = req.body.password;
      }
      if (body.password) {
        if (!isPasswordStrong(body.password)) {
          return res.status(400).json({ ok: false, message: "Password does not meet complexity requirements" });
        }
      }
      const existing = await AuthRepository.findById(id as string);
      if (!existing) return res.status(404).json({ ok: false, message: "User not found" });
      if ((req as any).file) {
        body.image = (req as any).file.filename;
      }
      if (body.password) {
        const passwordResult = await AuthService.changePassword(existing, body.password);
        if (!passwordResult.ok) return res.status(passwordResult.status).json(passwordResult);
        delete body.password;
      }
      const updated = await AuthRepository.updateUser(id as string, body as any);
      if (!updated) return res.status(404).json({ ok: false, message: "User not found" });

      const safeUser = {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        image: updated.image,
        mfaEnabled: Boolean((updated as any).mfaEnabled),
      };

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
      if (req.body?.password) {
        clearSessionCookies(res);
      }
      if (body.email && body.email !== existing?.email) {
        await AuthRepository.markEmailUnverified(id);
        await AuthRepository.invalidateSessions(id);
        clearSessionCookies(res);
        void AuthService.resendVerification({ email: body.email });
      }

      return res.status(200).json({ ok: true, user: safeUser });
    } catch (err) {
      console.error('AuthController.updateUser error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = (req as any).user as { sub?: string; role?: string } | undefined;

      if (!id || typeof id !== "string" || !isValidObjectId(id)) {
        return res.status(400).json({ ok: false, message: "Invalid user id" });
      }

      if (!currentUser?.sub) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      if (currentUser.role !== "admin" && currentUser.sub !== id) {
        return res.status(403).json({ ok: false, message: "Forbidden" });
      }

      const deleted = await PrivacyService.deleteAccount(id as string);
      if (!deleted) return res.status(404).json({ ok: false, message: "User not found" });
      if (currentUser.sub === id) clearSessionCookies(res);

      if ((deleted as any).image) {
        await deleteUploadFile((deleted as any).image);
      }
      await ActivityService.log("account_deleted", "Account and related personal data deleted");

      return res.status(200).json({ ok: true, message: "User deleted" });
    } catch (err) {
      console.error('AuthController.deleteUser error', err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  },
};
