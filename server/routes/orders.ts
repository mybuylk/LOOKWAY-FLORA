import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get user's orders
router.get("/", authenticate, async (req: any, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        // Map to what frontend expects if different
        const formattedOrders = orders.map(order => ({
            ...order.toObject(),
            total: order.totalAmount,
            status: order.orderStatus
        }));
        res.json(formattedOrders);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Create new order
router.post("/", authenticate, async (req: any, res) => {
    try {
        const { items, total, status, paymentMethod } = req.body;
        
        if (paymentMethod === "wallet") {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if ((user.walletBalance || 0) < total) {
                return res.status(400).json({ message: "Insufficient wallet balance" });
            }
            user.walletBalance -= total;
            user.transactions.push({
                amount: total,
                type: "purchase",
                date: new Date(),
                receiptId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()
            });
            await user.save();
        }

        const newOrder = new Order({
            userId: req.user.id,
            items: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: total,
            orderStatus: status?.toLowerCase() || "processing",
            paymentStatus: paymentMethod === "wallet" ? "paid" : "pending"
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ order: savedOrder, walletDecucted: paymentMethod === "wallet" });
    } catch (err: any) {
        console.error("Order creation error:", err);
        res.status(400).json({ message: err.message });
    }
});

export default router;
