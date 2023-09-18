"use strict";

import functions from "firebase-functions";

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

addMiddleware();
addTestingRoutes();
addRoutes();

export default functions
  .region("europe-west6")
  .runWith({ timeoutSeconds: 300, memory: "256MB" })
  .https.onRequest(app);
