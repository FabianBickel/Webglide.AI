import express from "express";
import createGptFunction from "./createGptFunction.js";

const snippetRouter = express.Router();

snippetRouter.get("/html", async (request, response) => {

  const prompt = request.body.prompt;
  const functionName = "returnHtmlSnippet";
  const functionDescription = "Returns the HTML snippet for the given prompt to the user";
  const parameterHtmlSnippet = [
    "htmlSnippet",
    "The snippet you want to return to the user"
  ];

  const getHtmlSnippet = createGptFunction(prompt, functionName, functionDescription);
  getHtmlSnippet.addParameter(...parameterHtmlSnippet);
  const argumentsObject = await getHtmlSnippet();

  const htmlSnippet = argumentsObject.htmlSnippet;
  response.status(200).send(htmlSnippet);
});

snippetRouter.get("/css", async (request, response) => {

  const prompt = request.body.prompt;
  const functionName = "returnCssSnippet";
  const functionDescription = "Returns the CSS snippet for the given prompt to the user";
  const parameterCssSnippet = [
    "cssSnippet",
    "The snippet you want to return to the user"
  ];

  const getCssSnippet = createGptFunction(prompt, functionName, functionDescription);
  getCssSnippet.addParameter(...parameterCssSnippet);
  const argumentsObject = await getCssSnippet();

  const cssSnippet = argumentsObject.cssSnippet;
  response.status(200).send(cssSnippet);
});

snippetRouter.get("/js", async (request, response) => {

  const prompt = request.body.prompt;
  const functionName = "returnJsSnippet";
  const functionDescription = "Returns the JavaScript snippet for the given prompt to the user";
  const parameterJsSnippet = [
    "jsSnippet",
    "The snippet you want to return to the user"
  ];

  const getJsSnippet = createGptFunction(prompt, functionName, functionDescription);
  getJsSnippet.addParameter(...parameterJsSnippet);
  const argumentsObject = await getJsSnippet();

  const jsSnippet = argumentsObject.jsSnippet;
  response.status(200).send(jsSnippet);
});

export default snippetRouter;