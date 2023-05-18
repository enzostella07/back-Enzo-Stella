import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      //Para no copiar el mismo codigo, me traigo la linea haciendo esto:
      let products = await this.getProducts();

      // ¿existe el producto?
      if (products.some((prod) => prod.code === product.code)) {
        return "Product exists";
      }

      // propiedades del producto
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock ||
        !product.category
      ) {
        return console.log("error");
      }

      // Else, push product
      const id = (Math.random() * 1000000000).toFixed(0).toString(),
        newProduct = { id: id, ...product };
      products.push(newProduct);

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return "product added succesfully";
    } catch (e) {
      throw new Error(e);
    }
  }

  async getProducts() {
    let products = [];
    try {
      if (fs.existsSync(this.path)) {
        const fileData = await fs.promises.readFile(this.path, "utf-8");
        products = JSON.parse(fileData);
      }
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    try {
      let products = await this.getProducts();
      const productFound = products.find((product) => product.id == id);
      if (!productFound) {
        throw new Error("product not found");
      }
      return productFound;
    } catch (error) {
      throw new Error(error);
    }
  }


  async deleteProduct(id) {
    let products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id == id);
    if (productIndex == -1) {
      return "product whit id not found";
    }
    products.splice(productIndex, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async updateProduct(id, newProductData) {
    //obtengo la lista de productos
    const products = await this.getProducts();

    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return `product whit id: ${id}. not found`;
    }

    //actualizo
    products[productIndex] = {
      ...products[productIndex],
      ...newProductData,
    };

    //guardo los cambios en el archivo
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[productIndex];
  }
}
export default ProductManager;
