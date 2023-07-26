import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("--mode <mode>", "Modo de trabajo", "DEVELOPMENT");
program.parse();

dotenv.config({
  path:
    program.opts().mode === "DEVELOPMENT"
      ? "./.env.dev"
      : "./.env.prod",
});

console.log(process.env);

export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};
