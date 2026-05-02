import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req: Request & { user?: any }, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const topupWallet = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { amount, depositDate, proof } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid top-up amount" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receiptId = "RCPT-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    // user.walletBalance = (user.walletBalance || 0) + Number(amount); // Removed for manual admin approval
    user.transactions.push({
      amount: Number(amount),
      type: "deposit",
      date: new Date(),
      depositDate: depositDate ? new Date(depositDate) : new Date(),
      receiptId,
      proof
    });

    await user.save();
    
    res.json({
      message: "Wallet top-up requested successfully",
      // walletBalance: user.walletBalance,
      transaction: user.transactions[user.transactions.length - 1]
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
