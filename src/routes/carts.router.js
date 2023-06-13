import express from "express";
import CartManager from "../services/CartManager.js";

export const cartsRouter = express.Router();

cartsRouter.get('/:cid', (async (req, res) => {
  const { cid } = req.params
  const cart = await CartManager.getById(cid)
  res.status(200).json({
    success: true,
    payload: cart.products
  })
}))

cartsRouter.post('/', (async (_req, res) => {
  const cart = await CartManager.create()
  res.status(201).json({
    success: true,
    payload: JSON.parse(JSON.stringify(cart._id))
  })
}))


cartsRouter.post('/:cid/product/:pid', (async (req, res) => {
  try {
    const { cid, pid } = req.params
    await CartManager.addProductToCart(cid, pid)
    res.status(200).json({
      success: true
    })
  } catch (error) {
    throw error
  }
}))

cartsRouter.put('/:cid', (async (req, res) => {
  try {
    await CartManager.updateCart(req.params.cid, req.body)
    res.status(200).json({
      success: true
    })
  } catch (error) {
    throw error
  }
}))

cartsRouter.delete('/:cid/product/:pid', (async (req, res) => {
  const { cid, pid } = req.params
  await CartManager.removeProductInCart(cid, pid)
  res.status(200).json({
    success: true
  })
}))

cartsRouter.delete('/:cid', (async (req, res) => {
  await CartManager.deleteProducts(req.params.cid)
  res.status(200).json({
    success: true
  })
}))
