import { ProductModel } from "../DAO/models/products.model.js";
import { CartModel } from "../DAO/models/carts.model.js";


class CartManager {
  async getAll (limit = null) {
    try {
      return await CartModel.find({}).limit(limit).lean()
    } catch {
      return []
    }
  }

  async getById (cid) {
    const cart = await CartModel
      .findOne({ _id: cid }).populate('products.product')
    return cart
  }

  async create () {
    return await CartModel.create({})
  }

  async addProductToCart (cid, pid) {
    const product = await ProductModel.findOne({ _id: pid }).lean()
    const cart = await CartModel.findOne({ _id: cid })
    const productIndex = cart.products.findIndex(item => item.product._id.toString() === pid)

    if (productIndex === -1) {
      if (product.stock === 0)
      cart.products.push({ product: product._id })
      return await cart.save()
    }

    if (product.stock < cart.products[productIndex].quantity + 1)
    cart.products[productIndex].quantity += 1
    return await cart.save()
  }

  async updateCart (cid, data) {
    const cart = await CartModel.findOne({ _id: cid })
    cart.products = []

    data.forEach(async item => {
      const product = await ProductModel.findOne({ _id: item.prodId })
      cart.products.push({ product: product._id, quantity: item.quantity })
    })
    return await cart.save()
  }

  async deleteProducts (cid) {
    const cart = await CartModel.findOne({ _id: cid })
    cart.products = []
    return await cart.save()
  }
}

export default CartManager;