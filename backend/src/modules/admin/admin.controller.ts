import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRepository } from "../auth/auth.repository";
import { deleteUploadFile } from "../../utils/file";

export const AdminController = {
  async create(req: Request, res: Response) {
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

  async list(_req: Request, res: Response) {
    const users = await (AuthRepository.findAll as any)();
    return res.status(200).json({ ok: true, users });
  },

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const user = await AuthRepository.findById(id as string);
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });
    return res.status(200).json({ ok: true, user });
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as any;
      const existing = await AuthRepository.findById(id as string);
      if ((req as any).file) {
        body.image = (req as any).file.filename;
      }
      // don't allow password update here unless explicitly provided
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

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = await AuthRepository.deleteUser(id as string);
    if (!deleted) return res.status(404).json({ ok: false, message: "User not found" });

    if ((deleted as any).image) {
      await deleteUploadFile((deleted as any).image);
    }

    return res.status(200).json({ ok: true, message: "User deleted" });
  },
};

export default AdminController;
