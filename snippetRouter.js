import express from "express";
import checkForUndefined from "./checkForUndefined.js";
import gptFunctionBuilder from "./gptFunction.js";
import gptPrompt from "./gptPrompt.js";

const snippetRouter = express.Router();

snippetRouter.get("/html", async (request, response) => {

  let argumentsObject;
  do {
    const prompt = request.body.prompt;
    const functionName = "returnHtmlSnippet";
    const functionDescription = "Returns the HTML snippet for the given prompt to the user";
    const parameterHtmlSnippet = [
      "htmlSnippet",
      "The snippet you want to return to the user"
    ];

    const htmlPrompt = new gptPrompt();
    htmlPrompt.addMessage(prompt);
    const htmlFunctionBuilder = new gptFunctionBuilder(functionName, functionDescription);
    htmlFunctionBuilder.addParameter(...parameterHtmlSnippet);
    const htmlFunction = htmlFunctionBuilder.build();
    htmlPrompt.addGptFunction(htmlFunction);
    const htmlPromise = htmlPrompt.send();

    const responseObject = await htmlPromise;
    console.log(JSON.stringify(responseObject, null, 2));
    argumentsObject = responseObject.arguments;
  } while (argumentsObject === undefined);

  const htmlSnippet = argumentsObject.htmlSnippet;
  response.status(200).send(htmlSnippet);
});

export default snippetRouter;