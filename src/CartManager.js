import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    if (fs.existsSync(path)) {
      const fileData = fs.readFileSync(this.path, "utf-8");
      const productsFile = JSON.parse(fileData);
      this.products = productsFile;
    } else {
      fs.writeFileSync(path, "[]");
      this.products = [];
    }
  }
  async getCarts() {
    if (!fs.existsSync("carts.json")) {
      fs.writeFileSync("carts.json", "[]", "utf-8");
      return "cart created";
    } else {
      const fileData = await fs.promises.readFile(this.path, "utf-8");
      const data = JSON.parse(fileData);
      return data;
    }
  }


  async addCart(object) {
    try {
      const dataCart = await this.getCarts();
      if (dataCart.length > 0) {
        const lastId = dataCart[dataCart.length - 1].id + 1;
        const newCart = { ...object, id: lastId };
        dataCart.push(newCart);
        const dataCartString = JSON.stringify(dataCart, null, 2);
        fs.writeFileSync(this.path, dataCartString);
        return newCart;
      } else {
        const newCart = { ...object, id: 1 };
        dataCart.push(newCart);
        const dataCartString = JSON.stringify(dataCart, null, 2);
        fs.writeFileSync(this.path, dataCartString);
        return newCart;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getCartById(id) {
    try {
      const dataCart = await this.getCarts();
      const cart = dataCart.find((cart) => cart.id === id);
      if (cart) {
        return cart;
      } else {
        return `No existe el carrito id: ${id}`;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async updateCart(id, productId) {
    try {
      const dataCart = await this.getCarts();
      const cart = dataCart.find((cart) => cart.id == id);
      if (cart) {
        const product = cart.products.find(
          (product) => product.idProduct == productId
        );
        if (product) {
          product.quantity = product.quantity + 1;
          const index = cart.products.indexOf(product);
          cart.products.splice(index, 1, product);
          const indexCart = dataCart.indexOf(cart);
          dataCart.splice(indexCart, 1, cart);
          const productsString = JSON.stringify(dataCart, null, 2);
          fs.writeFileSync(this.path, productsString);
          return product;
        } else {
          cart.products.push({ idProduct: productId, quantity: 1 });
          const indexCart = dataCart.indexOf(cart);
          dataCart.splice(indexCart, 1, cart);
          const productsString = JSON.stringify(dataCart, null, 2);
          fs.writeFileSync(this.path, productsString);
        }
      } else {
        return "No existe el carrito";
      }
    } catch (e) {
      console.log(e);
    }
  }

  async deleteCart(id) {
    try {
      const dataCart = await this.getCarts();
      const cart = dataCart.find((cart) => cart.id == id);
      if (cart) {
        const index = dataCart.indexOf(cart);
        dataCart.splice(index, 1);
        const productsString = JSON.stringify(dataCart, null, 2);
        fs.writeFileSync(this.path, productsString);
        return "deleted cart";
      } else {
        return "The cart does not exist.";
      }
    } catch (e) {
      console.log(e);
    }
  }

  async deleteAll() {
    try {
      fs.writeFileSync("carts.json", "[]", "utf-8");
      return "Deleted";
    } catch (e) {
      console.log(e);
    }
  }
}

export default CartManager;