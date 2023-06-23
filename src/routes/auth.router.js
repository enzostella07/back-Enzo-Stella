import express from "express";
import { UserModel } from "../DAO/models/users.model.js";
import { isUser, isAdmin } from "../middlewares/auth.js";
import { ProductModel } from "../DAO/models/products.model.js";

export const authRouter = express.Router();

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
    req.session.isadmin = usuarioEncontrado.role;
    req.session.first_name = usuarioEncontrado.first_name;
    // return res.redirect("/auth/perfil");
    return res.redirect("/products");
  } else {
    return res.status(401).render("error", { error: "email o pass mal" });
  }
});

authRouter.get("/register", (req, res) => {
  return res.render("register", {});
});

authRouter.post("/register", async (req, res) => {
  try {
    const { email, pass, first_name, last_name, age } = req.body;
    console.log(email, pass, first_name, last_name, age);
    if (!email || !pass || !first_name || !last_name || !age) {
      return res
        .status(400)
        .render("error", { error: "Completar todos los campos correctamente" });
    }
    const userFound = await UserModel.findOne({ email: email });
    if (userFound) {
      return res
        .status(400)
        .render("error", { error: "El mail ya se encuentra en uso. " });
    }
    await UserModel.create({
      email,
      pass,
      first_name,
      last_name,
      age,
      role: "user",
    });
    req.session.email = email;
    req.session.pass = pass;
    req.session.first_name = first_name;
    req.session.last_name = last_name;
    req.session.age = age;
    req.session.role = "user";

    console.log("email", email);
    console.log("req.session", req.session);

    return res.redirect("/products");
  } catch (error) {
    console.log(error);
    return res.status(400).render("error", {
      error: "No se pudo crear el usuario. Intente con otro mail",
    });
  }
});

authRouter.get("/perfil", isUser, (req, res) => {
  const role =
    req.session.role === "admin" ? "Administrador" : "Usuario Estándar";
  return res.render("perfil", {
    firstname: req.session.first_name,
    lastname: req.session.last_name,
    email: req.session.email,
    age: req.session.age,
    isadmin: role,
  });
});

authRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("error", { error: "no se pudo cerra la sesion" });
    }
    return res.redirect("/auth/login");
  });
});
