import { ProductModel } from "../DAO/models/products.model.js";

class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async getProducts(params) {
    const { limit, page, query, sort } = params;
    const queryMongo = { status: true };
    const pagination = {
      page,
      limit,
      customLabels: { docs: "payload" },
    };
    if (query) {
      queryMongo.$text = { $search: query };
    }
    if (sort) {
      pagination.sort = {
        price: sort,
      };
    }

    try {
      const result = await ProductModel.paginate(queryMongo, {
        ...pagination,
        lean: true,
      });
      const paramsPrev = new URLSearchParams(
        `limit=${limit}&page=${result.prevPage}&` + sort ??
          `&sort=${sort}` + query ??
          `&query=${query}`
      );
      const paramsNext = new URLSearchParams(
        `limit=${limit}&page=${result.nextPage}&` + sort ??
          `&sort=${sort}` + query ??
          `&query=${query}`
      );

      result.prevLink = result.prevPage
        ? `/api/products?${paramsPrev.toString()}`
        : null;
      result.nextLink = result.nextPage
        ? `/api/products?${paramsNext.toString()}`
        : null;

      return JSON.parse(JSON.stringify(result));
    } catch {
      return [];
    }
  }

  async addProduct(data) {
    const isCodeExists = await ProductModel.findOne(
      ({ code: data.code })
    );
    return await ProductModel.create(data);
  }

  async getProductById(id) {
    const product = ProductModel.findOne({ _id: id }).lean();
    return product;
  }

  async deleteProduct(id) {
    const product = await ProductModel.findOne(({ _id: id }), {
      thumbnails: 1,
    });
    await ProductModel.deleteOne({ _id: id });
    await deleteThumbnails(product.thumbnails);
  }

  async updateProduct(id, changes) {
    const product = await ProductModel.findOne(({ _id: id }));
    const updated = product.updateOne({ $set: changes }, { new: true });
    return updated;
  }
}
export default ProductManager;
