import express from "express";
import promptBuilder from "./promptBuilder.js";
import functionBuilder from "./functionBuilder.js";

const siteBuilderRouter = express.Router();

siteBuilderRouter.get("/", async (request, response) => {

  const prompt = request.body.prompt;
  const siteBuilder = new promptBuilder(prompt);

  const htmlName = "returnHTML";
  const htmlDescription = "Returns the HTML for the given prompt to the user";
  const htmlParameter = [
    "html",
    "The HTML code for the website you want to return to the user"
  ];
  const htmlFunctionBuilder = new functionBuilder(htmlName, htmlDescription);
  htmlFunctionBuilder.addParameter(...htmlParameter);
  const htmlFunction = htmlFunctionBuilder.build();

  const cssName = "returnCSS";
  const cssDescription = "Returns the CSS for the given prompt to the user";
  const cssParameter = [
    "css",
    "The CSS code for the website you want to return to the user"
  ];
  const cssFunctionBuilder = new functionBuilder(cssName, cssDescription);
  cssFunctionBuilder.addParameter(...cssParameter);
  const cssFunction = cssFunctionBuilder.build();

  const jsName = "returnJS";
  const jsDescription = "Returns the JavaScript for the given prompt to the user";
  const jsParameter = [
    "js",
    "The JavaScript code for the website you want to return to the user"
  ];
  const jsFunctionBuilder = new functionBuilder(jsName, jsDescription);
  jsFunctionBuilder.addParameter(...jsParameter);
  const jsFunction = jsFunctionBuilder.build();

  siteBuilder.addFunction(htmlFunction);
  siteBuilder.addFunction(cssFunction);
  siteBuilder.addFunction(jsFunction);

  let argumentsObject;

  for (let i = 0; i < 3; i++) {
    try {
       argumentsObject = await siteBuilder.build();
      continue;
    } catch (error) {
      console.error(error);
    }
  }

  response.status(200).send(argumentsObject);
});

export default siteBuilderRouter;