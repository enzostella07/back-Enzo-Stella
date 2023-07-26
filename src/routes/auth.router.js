import express from "express";
import { UserModel } from "../DAO/models/users.model.js";
import { isUser } from "../middlewares/auth.js";

export const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  return res.render("login", {});
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render("error", { error: "ponga su email y password" });
  }
  const usuarioEncontrado = await UserModel.findOne({ email: email });
  if (usuarioEncontrado && usuarioEncontrado.password == password) {
    req.session.email = usuarioEncontrado.email;
    req.session.isadmin = usuarioEncontrado.rol;
    req.session.first_name = usuarioEncontrado.first_name;
    return res.redirect("/products");
  } else {
    return res.status(401).render("error", { error: "email o password mal" });
  }
});

authRouter.get("/register", (req, res) => {
  return res.render("register", {});
});

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, first_name, last_name, age } = req.body;
    if (!email || !password || !first_name || !last_name || !age) {
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
      password,
      first_name,
      last_name,
      age,
      rol: "user",
    });
    req.session.email = email;
    req.session.password = password;
    req.session.first_name = first_name;
    req.session.last_name = last_name;
    req.session.age = age;
    req.session.rol = "user";

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
  const rol =
    req.session.rol === "admin" ? "Administrador" : "Usuario Estándar";
    return res.render("perfil", {
      firstname: req.session.first_name,
      lastname: req.session.last_name,
      email: req.session.email,
      age: req.session.age,
      isadmin: rol,
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
