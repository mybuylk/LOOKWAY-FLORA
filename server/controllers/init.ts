import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const performInitialization = async () => {
    // 1. Categories
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      await Category.insertMany([
        { name: "Electronics", slug: "electronics" },
        { name: "Apparel", slug: "apparel" },
        { name: "Lifestyle", slug: "lifestyle" },
        { name: "Home Goods", slug: "home-goods" }
      ]);
      console.log("Categories initialized");
    }

    // 2. Sample Admins
    const adminEmails = ["admin@lookway.com", "bloovalk@gmail.com"];
    for (const email of adminEmails) {
      const user = await User.findOne({ email });
      if (!user) {
        if (email === "admin@lookway.com") {
          await User.create({
            name: "Admin Flora",
            email: email,
            password: "adminpassword123",
            role: "admin"
          });
          console.log(`Admin initialized: ${email} / adminpassword123`);
        }
      } else if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
        console.log(`Updated existing user ${email} to admin role`);
      }
    }

    // 3. Sample Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const categories = await Category.find();
      const electronics = categories.find(c => c.slug === "electronics");
      const apparel = categories.find(c => c.slug === "apparel");
      
      const sampleProducts = [
        {
          name: "Premium Wireless Headphones",
          description: "High-fidelity audio with active noise cancellation and 40-hour battery life. Experience sound like never before.",
          price: 299.99,
          categoryId: electronics?._id,
          images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"],
          stock: 50,
          ratings: { average: 4.8, count: 124 }
        },
        {
          name: "Designer Wool Coat",
          description: "Handcrafted from sustainable merino wool. A timeless piece for the modern wardrobe.",
          price: 450.00,
          discountPrice: 399.99,
          categoryId: apparel?._id,
          images: ["https://images.unsplash.com/photo-1539533018447-920ade529ea4?q=80&w=1974&auto=format&fit=crop"],
          stock: 25,
          ratings: { average: 4.9, count: 86 }
        },
        {
          name: "Minimalist Smart Watch",
          description: "Sleek design meets powerful performance. Track your health and stay connected in style.",
          price: 199.00,
          categoryId: electronics?._id,
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"],
          stock: 100,
          ratings: { average: 4.7, count: 215 }
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log("Sample products initialized");
    }
};

export const initializeData = async (req: any, res: any) => {
  try {
    await performInitialization();
    res.json({ message: "Data initialization check complete" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
