import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, authorize(["admin", "vendor"]), createProduct);
router.put("/:id", authenticate, authorize(["admin", "vendor"]), updateProduct);
router.delete("/:id", authenticate, authorize(["admin", "vendor"]), deleteProduct);

export default router;
