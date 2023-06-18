import express from "express";
export const cartsRouter = express.Router();
import CartManager from "../services/CartManager.js";
const cartManager = new CartManager();

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.get(cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createOne();
    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartManager.updateCart(cid, products);
    res
      .status(200)
      .json({ status: "success", message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.removeProduct(cid, pid);
    res
      .status(200)
      .json({ status: "success", message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.clearCart(cid);
    res
      .status(200)
      .json({ status: "success", message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default cartsRouter;
