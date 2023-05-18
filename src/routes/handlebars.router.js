import express from "express";
import ProductManager from "../ProductManager.js";
const dataProd = new ProductManager("products.json");

export const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  try {
    const products = await dataProd.getProducts();
    return res.render("home", { products: products });
  } catch (error) {
    res.status(200).json({ succes: "false", msg: "Error", peyload: {} });
  }
});

export default homeRouter;
