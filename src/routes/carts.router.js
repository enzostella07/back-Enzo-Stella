import express from "express";
import ProductManager from "../ProductManager.js";
import CartManager from "../CartManager.js";

const products = new ProductManager("./products.json");
const carts = new CartManager("./carts.json");

export const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res) => {
  try {
    const data = await carts.getCarts();
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
    } else {
      res
        .status(500)
        .json({ status: "error", msg: "Error in server", data: {} });
    }
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
      const product = await carts.addCart();
      return res.status(201).json({ message: "complete cart creation" });
  } catch (error) {
      if (error.message === "error, reading or writting file") {
          res.status(409).json({ message: "cant create cart" })
      }
      else {
          console.log(error);
          res.status(500).json({ message: 'error desconocido' })
      }
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
    const data = await carts.getCarts();
    await carts.addCart({ products: [] });
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
    } else {
      res
        .status(500)
        .json({ status: "error", msg: "Error in server", data: {} });
    }
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const dataId = await carts.getCartById(parseInt(id));
    if (dataId) {
      res.status(200).json(dataId);
    } else {
      res.status(200).json(`not exist cart whit id: ${id}`);
    }
  } catch {
    res.status(500).json({ status: "error", msg: "Error in server", data: {} });
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const dataCarts = await carts.getCarts();
    const dataProducts = await products.getProducts();
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cartFound = dataCarts.find((ele) => ele.id == cartId);
    if (!cartFound) {
      res.status(200).json(`not exist cart whit id: ${cartId}`);
    }
    const productFound = dataProducts.find(
      (ele) => ele.id == parseInt(productId)
    );
    if (!productFound) {
      res.status(200).json(`not exist cart whit id: ${productId}`);
    }
    const product = await carts.updateCart(
      parseInt(cartId),
      parseInt(productId)
    );
    res.status(200).json(product);
  } catch {
    res.status(500).json({ status: "error", msg: "Error in server", data: {} });
  }
});