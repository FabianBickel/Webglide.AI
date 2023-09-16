import express from "express";
import checkForUndefined from "./checkForUndefined.js";
import buildSite from "./buildSite.js";

const buildSiteRouter = express.Router();

buildSiteRouter.get("/build", async (request, response) => {
  const prompt = request.body.prompt;
  checkForUndefined(prompt);

  const sitePromise = buildSite(prompt);
  const webPage = await sitePromise;
  console.log(webPage);
  response.status(200).json(webPage);
});

export default buildSiteRouter;
