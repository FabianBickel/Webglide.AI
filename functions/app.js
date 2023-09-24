"use strict";

import functions from "firebase-functions";

import snippetRouter from "./snippetRouter.js";
import siteRouter from "./siteRouter.js";

import express from "express";
import cors from "cors";

const app = express();
const apiRouter = express.Router();

const corsOptions = {
  origin: "*",
  allowedHeaders: "*",
};

function addMiddleware() {
  app.use(express.json());
  app.use(cors(corsOptions));
}

function addTestingRoutes() {
  app.get("/", (request, response) => {
    response.send("Hello World!");
  });
}

function addRoutes() {
  apiRouter.use("/snippet", snippetRouter);
  apiRouter.use("/site", siteRouter);
  app.use("/api/v1", apiRouter);
}

addMiddleware();
addTestingRoutes();
addRoutes();

export default functions
  .region("europe-west6")
  .runWith({ timeoutSeconds: 300, memory: "256MB" })
  .https.onRequest(app);
