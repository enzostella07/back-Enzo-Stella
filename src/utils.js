import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//-------------------DIRNAME----------------
// export const __filename = fileURLToPath(import.meta.url);
// export const __dirname = path.dirname(__filename);

import { connect } from "mongoose";
export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://enzostella07:5CWZTaHh5MDAbiIz@codercluster.ykyflk8.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}

//--------------SOCKET--------------
import { Server } from "socket.io";
import { MsgModel } from "./DAO/models/msgs.model.js";

export default function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);
  //BACK
  socketServer.on("connection", (socket) => {
    console.log("socketeeee");
    //BACK RECIBE
    socket.on("msg_front_to_back", async (msg) => {
      const msgCreated = await MsgModel.create(msg);
      const msgs = await MsgModel.find({});
      socketServer.emit("msg_back_to_front", msgs);
    });
  });

  socketServer.on("connection", (socket) => {
    socket.on("new-product", async (newProd) => {
      try {
        await data.addProduct({ ...newProd });
        const productList = await data.getProducts();
        console.log(productList);
        socketServer.emit("products", productList);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("delete-product", async (id) => {
      try {
        await data.deleteProduct(id);
        const productList = await data.getProducts();
        console.log(productList);
        socketServer.emit("products", productList);
      } catch (error) {
        console.log(error);
      }
    });
  });
}
