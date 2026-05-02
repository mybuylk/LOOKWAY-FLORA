import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer", "vendor"], default: "customer" },
  status: { type: String, enum: ["active", "banned"], default: "active" },
  walletBalance: { type: Number, default: 0 },
  transactions: [{
    amount: { type: Number, required: true },
    type: { type: String, enum: ["deposit", "withdrawal", "purchase"], required: true },
    date: { type: Date, default: Date.now },
    depositDate: { type: Date },
    receiptId: { type: String },
    proof: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
