import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Amount or Percentage
  expiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Coupon", couponSchema);
