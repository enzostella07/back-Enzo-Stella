import express from "express";
import productManager from "../services/ProductManager.js";

// const productManager = new ProductManager("./products.json");
export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  let { limit = 3, page = 1, query, sort } = req.query;
  if (sort && sort !== "asc" && sort !== "desc") {
    sort = "";
  }
  const payload = await productManager.getProducts({
    limit,
    page,
    query,
    sort,
  });
  res.status(200).json({
    success: true,
    ...payload,
  });
});

productsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productManager.getProductById(id);
  res.status(200).json({
    success: true,
    payload: product,
  });
});

productsRouter.post("/", async (req, res) => {
  const newProduct = await productService.addProduct(req.body)
  // Envio evento realtime a todos los sockets conectados. Si el producto fue agregado por alguien conectado en realtime se le enviara al resto
  // de lo contrario se le enviara a todo el mundo.
  req.clientSocket?.broadcast.emit('product:created', newProduct) ??
    req.ioServer.emit('product:created', newProduct)
  res.status(201).json({
    success: true,
    payload: newProduct
  })
})

productsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const productUpdated = await productManager.updateProduct(id, req.body);
  res.status(200).json({
    success: true,
    payload: productUpdated,
  });
});

productsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await productManager.deleteProduct(id);
  // Envio evento realtime a todos los sockets conectados. Si el producto fue eliminado por alguien conectado en realtime se le enviara al resto
  // de lo contrario se le enviara a todo el mundo.
  req.clientSocket?.broadcast.emit("product:deleted", id) ??
    req.ioServer.emit("product:deleted", id);
  res.status(200).json({
    success: true,
  });
});

export default productsRouter;
