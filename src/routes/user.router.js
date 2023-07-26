import express from "express";
import { UserService } from "../services/UserManager.js";

export const usersRouter = express.Router();

const Service = new UserService();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await Service.getAll();
    console.log(users);
    return res.status(200).json({
      status: "success",
      msg: "listado de usuarios",
      data: users,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

usersRouter.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const userCreated = await Service.createOne(first_name, last_name, email);
    return res.status(201).json({
      status: "success",
      msg: "user created",
      data: userCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    //TODO LLAMAR A OTA FUNCION
    return res.status(200).json({
      status: "success",
      msg: "user deleted",
      data: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

usersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;

    //TODO LLAMAR A OTRA FUNCION
    return res.status(201).json({
      status: "success",
      msg: "user uptaded",
      data: { _id: id, first_name, last_name, email },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});
