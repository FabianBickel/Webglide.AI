import express from "express";
import OpenAI from 'openai';
import createGPTFunction from "./function.js";

const app = express();
const apiRouter = express.Router();

app.use(express.json());

const conf = {
  apiKey: "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"
};
const openai = new OpenAI(conf);

apiRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

apiRouter.post("/htmlSnippet", async (request, response) => {

  const prompt = request.body.prompt;
  const functionName = "returnHtmlSnippet";
  const functionDescription = "Returns the HTML snippet for the given prompt to the user";
  const parameterHtmlSnippet = [
    "htmlSnippet",
    "The snippet you want to return to the user"
  ]

  const getHtmlSnippet = createGPTFunction(prompt, functionName, functionDescription);
  getHtmlSnippet.addParameter(...parameterHtmlSnippet);
  const argumentsObject = await getHtmlSnippet();

  const htmlSnippet = argumentsObject.htmlSnippet;
  response.status(200).send(htmlSnippet);
});

app.use("/api/v1", apiRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});