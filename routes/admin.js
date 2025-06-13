const express = require("express");
const { Product } = require("../models/product");
const admin = require("../middleware/admin_middleware");
const Order = require("../models/order");
const adminRouter = express.Router();

adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    
    const { name, description, category, price, images, quantity } = req.body;
    console.log("Request body:", req.body);

    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
    });
    product = await product.save();
    res.json(product);
    console.log(product);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

adminRouter.get("/admin/get-products", admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

adminRouter.delete("/admin/delete-products", admin, async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findByIdAndDelete(id);
    res.json(product);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

adminRouter.get("/admin/get-all-orders", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;

    const order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

adminRouter.get("/admin/analytics", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    let totalPrice = 0;
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        totalPrice +=
          orders[i].products[j].quantity * orders[i].products[j].product.price;
      }
    }
    let mobileEarnings = await fetchCategoryWiseProducts("Mobiles");
    let essentialEarnings = await fetchCategoryWiseProducts("Essentials");
    let appliancesEarnings = await fetchCategoryWiseProducts("Appliances");
    let booksEarnings = await fetchCategoryWiseProducts("Books");
    let fashionEarnings = await fetchCategoryWiseProducts("Fashion");
    let electronicsEarnings = await fetchCategoryWiseProducts("Electronics");
    let earnings = {
      totalPrice,
      mobileEarnings,
      essentialEarnings,
      appliancesEarnings,
      booksEarnings,
      fashionEarnings,
      electronicsEarnings,
    };
    res.json(earnings);

    
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

async function fetchCategoryWiseProducts(category) {
  let earnings = 0;
  let categoryProducts = await Order.find({
    "products.product.category": category,
  });

  for (let i = 0; i < categoryProducts.length; i++) {
    for (let j = 0; j < categoryProducts[i].products.length; j++) {
      earnings +=
        categoryProducts[i].products[j].quantity *
        categoryProducts[i].products[j].product.price;
    }
  }
  return earnings;
}

module.exports = adminRouter;
