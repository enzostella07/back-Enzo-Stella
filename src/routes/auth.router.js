import express from "express";
import { UserModel } from "../DAO/models/users.model.js";
import { isUser, isAdmin } from "../middlewares/auth.js";
import { ProductModel } from "../DAO/models/products.model.js";

export const authRouter = express.Router();

authRouter.get("/perfil", isUser, (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin };
  // const products = ProductModel.find({});
  return res.render("perfil", { user: user });
});

authRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("error", { error: "no se pudo cerra la sesion" });
    }
    return res.redirect("/auth/login");
  });
});

authRouter.get("/login", (req, res) => {
  return res.render("login", {});
});

authRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).render("error", { error: "ponga su email y pass" });
  }
  const usuarioEncontrado = await UserModel.findOne({ email: email });
  if (usuarioEncontrado && usuarioEncontrado.pass == pass) {
    req.session.email = usuarioEncontrado.email;
    req.session.isAdmin = usuarioEncontrado.isAdmin;
    return res.redirect("/auth/perfil");
  } else {
    return res.status(401).render("error", { error: "email o pass mal" });
  }
});

authRouter.get("/register", (req, res) => {
  return res.render("register", {});
});

authRouter.post("/register", async (req, res) => {
  try {
    const { email, pass, firstName, lastName } = req.body;
    console.log(email, pass, firstName, lastName);
    if (!email || !pass || !firstName || !lastName) {
      return res
        .status(400)
        .render("error", { error: "Completar todos los campos correctamente" });
    }
    await UserModel.create({
      email,
      pass,
      firstName,
      lastName,
      isAdmin: false,
    });
    console.log("email", email);
    console.log("req.session", req.session);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .render("error", {
        error: "No se pudo crear el usuario. Intente con otro mail",
      });
  }
});
