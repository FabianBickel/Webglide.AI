

import express from "express";
import checkForUndefined from "./checkForUndefined.js";
import buildSite from "./buildSite.js";

const buildSiteRouter = express.Router();

buildSiteRouter.get("/build", async (request, response) => {
  const prompt = request.body.prompt;
  checkForUndefined(prompt);

  const sitePromise = buildSite(prompt);
  const { html, css, js } = await sitePromise;

  const webPage = { html, css, js };
  response.status(200).send(webPage);
});

export default buildSiteRouter;