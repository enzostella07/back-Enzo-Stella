import express from "express";
import { ProductModel } from "../DAO/models/products.model.js";
import CartManager from "../services/CartManager.js";
import ProductManager from "../services/ProductManager.js";
export const viewsRouter = express.Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

viewsRouter.get("/", async (req, res) => {
  res.render("home");
});

viewsRouter.get("/login", async (req, res) => {
  res.render("login-github");
});

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const queryParams = { limit, page, sort, query };
    const products = await productManager.get(queryParams);
    return res.status(200).render("home", { products });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", msg: "Error in server", products: {} });
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.get();
    return res.status(200).render("realTimeProducts", { products });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", msg: "Error in server", products: {} });
  }
});

viewsRouter.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const queryParams = { limit, page };

    const {
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    } = await productManager.get(queryParams);

    let productsSimplified = products.map((item) => {
      return {
        _id: item._id.toString(),
        title: item.title,
        description: item.description,
        price: item.price,
        thumbnail: item.thumbnail,
        code: item.code,
        stock: item.stock,
        category: item.category,
      };
    });

    const rol = req.session.isadmin === "admin" ? true : false;

    return res.render("products", {
      products: productsSimplified,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: prevLink?.substring(4) || "",
      nextLink: nextLink?.substring(4) || "",
      firstname: req.session.first_name,
      lastname: req.session.last_name,
      isadmin: rol,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "Error in server" });
  }
});

viewsRouter.get("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await ProductModel.findById(pid);

    const productSimplificado = {
      _id: product._id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
      category: product.category,
    };

    res.render("product", { product: productSimplificado });
  } catch (error) {
    next(error);
  }
});

viewsRouter.get("/carts/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.get(cid);
    const simplifiedCart = cart.products.map((item) => {
      return {
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      };
    });
    res.render("cart", { cart: simplifiedCart });
  } catch (error) {
    next(error);
  }
});

export default viewsRouter;
