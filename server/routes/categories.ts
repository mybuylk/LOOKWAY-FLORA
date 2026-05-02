import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = req.body.name;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = new Category({ ...req.body, slug });
    await category.save();
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let slug;
    if (req.body.name) {
      slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    const updateData = slug ? { ...req.body, slug } : req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(category);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
