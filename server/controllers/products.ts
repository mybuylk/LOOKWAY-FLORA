import { Request, Response } from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, sort } = req.query;
    let query: any = {};

    if (category) {
      const cat = await Category.findOne({ slug: category as string });
      if (cat) query.categoryId = cat._id;
    }

    if (search) {
      query.name = { $regex: search as string, $options: "i" };
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === "price-asc") sortOptions = { price: 1 };
    if (sort === "price-desc") sortOptions = { price: -1 };

    const products = await Product.find(query).populate("categoryId").sort(sortOptions);
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req: any, res: Response) => {
  try {
    const product = new Product({
      ...req.body,
      vendorId: req.user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user is owner or admin
    const isOwner = product.vendorId && product.vendorId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const isOwner = product.vendorId && product.vendorId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
