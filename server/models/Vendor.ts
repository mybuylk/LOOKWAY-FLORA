import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  storeName: { type: String, required: true },
  commission: { type: Number, default: 10 }, // Percentage
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vendor", vendorSchema);
