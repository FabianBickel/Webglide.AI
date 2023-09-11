"use strict";

import express from "express";
import snippetRouter from "./snippetRouter.js";
import buildSiteRouter from "./buildSiteRouter.js";

const app = express();
const apiRouter = express.Router();

function addMiddleware() {
  app.use(express.json());
}

function addTestingRoutes() {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
}

function addRoutes() {
  apiRouter.use("/snippet", snippetRouter);
  apiRouter.use("/site", buildSiteRouter);
  app.use("/api/v1", apiRouter);
}

function startServer() {
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

addMiddleware();
addTestingRoutes();
addRoutes();
startServer();