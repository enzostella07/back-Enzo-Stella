import express from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("../products.json");
export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      res.status(200).json(products.slice(0, limit));
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ message: "There was an error" });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await productManager.getProductById(parseInt(id));
    if (!product) {
      res.status(404).status(500).json({ error: "product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "There was an error" });
  }
});


productsRouter.post('/', async (req, res) => {
  try {
      const {title, description, code, price, stock, category, thumbnail} = req.body;
      const newProduct = {
          // id: uuidv4(),
          id : (Math.random() *1000000000).toFixed(0).toString(),
          title,
          description,
          code,
          price,
          status: true,
          stock,
          category,
          thumbnail: thumbnail || []
      };
      await productManager.addProduct(newProduct);
      return res.status(201).json(newProduct);
  }catch(error){
      console.error(error);
      return res.status(500).json({message: "Internal Server Error"});
  }
});


productsRouter.put("/:pid", async (req, res) => {
  try {
      const id = req.params.pid
      let changeProduct = req.body;
      await productManager.updateProduct(id, changeProduct);
      return res.status(201).json({
          status: "Success",
          msg: "product updated",
          data: changeProduct
      })
  } catch {
      res.status(500).json({ status: "error", msg: "Invalid input", data: {} })
  }
})

productsRouter.delete('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  try{
      const deletedProduct = await productManager.deleteProduct(id);
      res.status(200).json(message, "Producto borrado con el id" + id);
  }catch(err){
      res.status(404).json({error: err.message});
  }
})

export default productsRouter