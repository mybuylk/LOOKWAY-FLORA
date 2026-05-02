import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Settings from "../models/Settings.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(["admin"]));

router.get("/dashboard", async (req, res) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        
        // Recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("userId", "name");

        const formattedRecentOrders = recentOrders.map(order => ({
            ...order.toObject(),
            total: order.totalAmount,
            status: order.orderStatus
        }));

        res.json({
            stats: {
                revenue: totalRevenue[0]?.total || 0,
                orders: totalOrders,
                users: totalUsers,
                products: totalProducts
            },
            recentOrders: formattedRecentOrders
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("userId", "name email");
        
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

router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/users/:userId", async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.userId, { role }, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/topups", async (req, res) => {
    try {
        const users = await User.find({ "transactions.type": "deposit" }).select("name email transactions");
        const topups: any[] = [];
        
        users.forEach(user => {
            user.transactions.forEach((tx: any) => {
                if (tx.type === "deposit") {
                    topups.push({
                        user: { name: user.name, email: user.email },
                        amount: tx.amount,
                        date: tx.date,
                        depositDate: tx.depositDate,
                        receiptId: tx.receiptId,
                        proof: tx.proof
                    });
                }
            });
        });

        // Sort descending by date
        topups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        res.json(topups);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/topups/approve", async (req, res) => {
    try {
        const { receiptId } = req.body;
        const user = await User.findOne({ "transactions.receiptId": receiptId });
        if (!user) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        const transaction = user.transactions.find((tx: any) => tx.receiptId === receiptId);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        
        transaction.depositDate = new Date();
        user.walletBalance = (user.walletBalance || 0) + transaction.amount;
        await user.save();
        
        res.json({ message: "Topup approved" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/topups/reject", async (req, res) => {
    try {
        const { receiptId } = req.body;
        const user = await User.findOneAndUpdate(
            { "transactions.receiptId": receiptId },
            { $pull: { transactions: { receiptId } } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        
        res.json({ message: "Topup rejected" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/orders/:orderId", async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.orderId, { orderStatus: status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Order updated successfully", order });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/settings", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/settings", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }
        res.json(settings);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/analytics", async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(dailyStats);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
