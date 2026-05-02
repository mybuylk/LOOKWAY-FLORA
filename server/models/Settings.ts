import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: "My Shop" },
  contactEmail: { type: String, default: "admin@myshop.com" },
  currencySymbol: { type: String, default: "$" },
  maintenanceMode: { type: Boolean, default: false },
  bankDetails: { type: String, default: "" }
});

export default mongoose.model("Settings", settingsSchema);
