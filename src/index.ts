import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
import express from "express";
import { PORT } from "./config";

const StartServer = async () => {
  const app = express();

  await dbConnection();

  await App(app);

  app.listen(PORT, () => {
    console.log(`Connected To Port is : ${PORT}`);
  });
};

StartServer();
