import express from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";
import bcrypt from "bcrypt";

const router = express.Router();
const port = 3000;
const prisma = new PrismaClient();
const saltRounds = 10;
env.config();

router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  } else {
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      req.session.user = user;
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
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
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
