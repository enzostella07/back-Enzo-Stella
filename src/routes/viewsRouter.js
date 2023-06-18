import express from "express";
export const viewsRouter = express.Router();
import ProductManager from "../services/ProductManager.js";
const productManager = new ProductManager();
import CartManager from "../services/CartManager.js";
const cartManager = new CartManager();

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const queryParams = { limit, page, sort, query };
    const products = await productManager.get(queryParams);
    console.log(products);
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

    return res.render("products", {
      products: productsSimplified,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: prevLink?.substring(4) || "",
      nextLink: nextLink?.substring(4) || ""
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "Error in server" });
  }
});

viewsRouter.get("/carts/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.get(cid);
    res.render("cart", { cart });
  } catch (error) {
    next(error);
  }
});

export default viewsRouter;
