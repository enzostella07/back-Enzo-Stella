import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";
import { cartsRouter } from "./routes/carts.router.js";
import { homeRouter } from "./routes/handlebars.router.js";
import { productsRouter } from "./routes/products.router.js";
import { realTimeProductRouter } from "./routes/realTimeProductsRouter.js";
import { __dirname } from "./utils.js";

const data = new ProductManager("products.json");
const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
const socketServer = new Server(httpServer);

//socket
socketServer.on("connection", (socket) => {
  console.log("se abrio un canal de socket con id:" + socket.id);
  socket.on("new-product", async (newProd) => {
    try {
      await data.addProduct({ ...newProd });
      const productList = await data.getProducts();
      console.log(productList);
      socketServer.emit("products",  productList );
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("delete-product", async (id)=>{
    try {
      await data.deleteProduct(id)
      const productList = await data.getProducts();
      console.log(productList);
      socketServer.emit("products",  productList );
    } catch (error) {
      console.log(error);
    }
  })
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", homeRouter);
app.use("/realtimeproducts", realTimeProductRouter);

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "not found",
    data: {},
  });
});
