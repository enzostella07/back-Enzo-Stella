import express from "express";
import ProductManager from "../services/ProductManager.js";
const productManager = new ProductManager();

export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const queryParams = req.query;
    const response = await productManager.get(queryParams);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.get(pid);
    return res.status(200).json({
      status: "success",
      msg: "producto",
      data: product,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, category } =
      req.body;
    const productCreated = await productManager.createOne(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category
    );
    return res.status(201).json({
      status: "success",
      msg: "product created",
      data: productCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "error en validaciones",
      data: {},
    });
  }
});

productsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail, code, stock, category } =
      req.body;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category
    ) {
      console.log("validation error: please complete all fields.");
      return res.status(400).json({
        status: "error",
        msg: "validation error: please complete all fields.",
        data: {},
      });
    }

    const productUpdated = await productManager.updateOne(
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category
    );
    return res.status(200).json({
      status: "success",
      msg: "product updated",
      data: productUpdated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :)",
      data: {},
    });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productDeleted = await productManager.deleteOne(id);
    return res.status(200).json({
      status: "success",
      msg: "product deleted",
      data: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

export default productsRouter;
