import express from "express";
import ProductManager from "../ProductManager.js";
const dataProd = new ProductManager("products.json");

export const realTimeProductRouter = express.Router();

realTimeProductRouter.get("/", async (req, res) => {
  try {
    const products = await dataProd.getProducts();
    return res.render("realTimeProducts", { products: products });
  } catch (error) {
    res.status(500).json({ succes: "false", msg: "error", payload: {} });
  }
});

export default realTimeProductRouter;
