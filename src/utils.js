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
import { CartModel } from "./DAO/models/carts.model.js";
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
  import ProductManager from "./services/ProductManager.js";
  
  export default function connectSocket(httpServer) {
    const socketServer = new Server(httpServer);
    socketServer.on("connection", (socket) => {
      console.log("New user connected");
      
      socket.on("addProduct", async (entries) => {
        const product = await ProductManager.createOne(entries);
        socketServer.emit("addedProduct", product);
      });
      
      socket.on("deleteProduct", async (id) => {
        await ProductManager.deleteOne(id);
        socketServer.emit("deletedProduct", id);
      });
      
      socket.on("msg_front_to_back", async (msg) => {
        const msgCreated = await MsgModel.create(msg);
        const messages = await MsgModel.find({});
        socketServer.emit("msg_back_to_front", messages);
      });
    });
  }
  connectSocket();

//----------------bcrypt------------------------------
import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);