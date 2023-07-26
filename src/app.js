import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import passport from "passport";
import path from "path";
import env from "./config/config.js";
import { iniPassport } from "./config/passport.config.js";
import { authRouter } from "./routes/auth.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { testSocketChatRouter } from "./routes/test.socket.chat.router.js";
import { usersRouter } from "./routes/users.router.js";
import { viewsRouter } from "./routes/viewsRouter.js";
import connectSocket, { __dirname, connectMongo } from "./utils.js";

dotenv.config();
console.log("hola", env);

const app = express();
const PORT = env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening on PORT http://localhost:${PORT}`);
});

connectMongo();
connectSocket(httpServer);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://enzostella07:5CWZTaHh5MDAbiIz@codercluster.ykyflk8.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 7200,
    }),
    secret: "unsecreto",
    resave: true,
    saveUninitialized: true,
  })
);

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/test-chat", testSocketChatRouter);
app.use("/auth", authRouter);



app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "not found",
    data: {},
  });
});
