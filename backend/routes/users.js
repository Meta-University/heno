import express from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;
env.config();

router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!email?.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  if (!role || !["PM", "TM"].includes(role)) {
    return res.status(400).json({ message: "Please select a valid role (PM or TM)" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim() },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        role,
      },
    });
    req.session.user = user;
    res.json({ user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message || "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.user = user;
      res.json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users/search", async (req, res) => {
  const { query } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
