import express from "express";
import createGPTFunction from "./function.js";

const snippetRouter = express.Router();

snippetRouter.post("/html", async (request, response) => {

  const prompt = request.body.prompt;
  const functionName = "returnHtmlSnippet";
  const functionDescription = "Returns the HTML snippet for the given prompt to the user";
  const parameterHtmlSnippet = [
    "htmlSnippet",
    "The snippet you want to return to the user"
  ];

  const getHtmlSnippet = createGPTFunction(prompt, functionName, functionDescription);
  getHtmlSnippet.addParameter(...parameterHtmlSnippet);
  const argumentsObject = await getHtmlSnippet();

  const htmlSnippet = argumentsObject.htmlSnippet;
  response.status(200).send(htmlSnippet);
});

export default snippetRouter;