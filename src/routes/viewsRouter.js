import express from "express";
import productManager from "../services/ProductManager.js";

export const homeRouter = express.Router();

homeRouter.get('/', async (req, res) => {
  const products = await productManager.getProducts({ limit: 4, page: 1 })
  res.render('realtimeProducts', { products })
})

homeRouter.get('/realtimeProducts', async (req, res) => {
  const products = await productManager.getProducts({ limit: 4, page: 1 })
  res.render('home', { products })
})

export default homeRouter
