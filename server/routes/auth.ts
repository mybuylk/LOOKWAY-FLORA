import express from "express";
import { register, login, getMe, topupWallet } from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/wallet/topup", authenticate, topupWallet);

export default router;
