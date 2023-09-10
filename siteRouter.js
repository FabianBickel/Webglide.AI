"use strict";

import express from "express";
import createGptFunction from "./createGptFunction.js";

const siteRouter = express.Router();

siteRouter.get("/build", async (request, response) => {

  try {
    console.log("Request received: " + request.body.prompt);
    const userPrompt = request.body.prompt;
    console.log("Generating planning prompts...")
    const {
      htmlPrompt,
      cssPrompt,
      jsPrompt
    } = await getPrompts(userPrompt);
    console.log("Prompts received:\n---\n" + htmlPrompt + "\n---\n" + cssPrompt + "\n---\n" + jsPrompt + "\n---");

    console.log("Generating HTML, CSS and JS snippets...");
    const htmlPromise = getHTML(htmlPrompt);
    const cssPromise = getCSS(cssPrompt);
    const jsPromise = getJS(jsPrompt);

    // const htmlSnippet = await htmlPromise;
    // const cssSnippet = await cssPromise;
    // const jsSnippet = await jsPromise;
    const [htmlSnippet, cssSnippet, jsSnippet] = await Promise.all([htmlPromise, cssPromise, jsPromise]);
    
    const webPage = {
      "html": htmlSnippet,
      "css": cssSnippet,
      "js": jsSnippet
    };
    console.log("Snippets received:\n---\n" + htmlSnippet + "\n\n" + cssSnippet + "\n\n" + jsSnippet + "\n---");
    JSON.stringify(webPage, null, 2);

    response.status(200).send(webPage);
  } catch (error) {
    response.status(500).send(error);
  }


  async function getPrompts(prompt) {
    const planningPrompt = `
You are planning the creation of a website to the customer's specifications.
The customer wants the following: ${prompt}
Your task is it to create prompt for GPT to create the HTML, CSS and JavaScript for the website.
Give detailed instructions to GPT-3 on how to create the website.
You have to tell GPT-3 exactly how the HTML, CSS and JS should interface with one another, what needs to be imported, etc.
Make sure the names for imports and exports are exactly the same in each prompt.
`;

    const functionName = "returnPrompts";
    const functionDescription = "Returns the prompts for the given prompt to the user";
    const htmlParameter = [
      "htmlPrompt",
      "The prompt for creating the page's HTML"
    ];
    const cssParameter = [
      "cssPrompt",
      "The prompt for creating the page's CSS"
    ];
    const jsParameter = [
      "jsPrompt",
      "The prompt for creating the page's JavaScript"
    ];

    const getPrompts = createGptFunction(planningPrompt, functionName, functionDescription);
    getPrompts.addParameter(...htmlParameter);
    getPrompts.addParameter(...cssParameter);
    getPrompts.addParameter(...jsParameter);
    const argumentsObject = await getPrompts();

    const htmlPrompt = argumentsObject.htmlPrompt;
    const cssPrompt = argumentsObject.cssPrompt;
    const jsPrompt = argumentsObject.jsPrompt;

    return {
      "htmlPrompt": htmlPrompt,
      "cssPrompt": cssPrompt,
      "jsPrompt": jsPrompt
    };
  }

  async function getHTML(prompt) {
    const functionName = "returnHtml";
    const functionDescription = "Returns the HTML for the given prompt to the user";
    const parameterHtmlSnippet = [
      "HTML",
      "The HTML code you want to return to the user"
    ];

    const getHtmlSnippet = createGptFunction(prompt, functionName, functionDescription);
    getHtmlSnippet.addParameter(...parameterHtmlSnippet);

    return new Promise(async (resolve, reject) => {
      try {
        const argumentsObject = await getHtmlSnippet();
        const htmlSnippet = argumentsObject.htmlSnippet;
        resolve(htmlSnippet);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function getCSS(prompt) {
    const functionName = "returnCss";
    const functionDescription = "Returns the CSS for the given prompt to the user";
    const parameterCssSnippet = [
      "CSS",
      "The CSS code you want to return to the user"
    ];

    const getCssSnippet = createGptFunction(prompt, functionName, functionDescription);
    getCssSnippet.addParameter(...parameterCssSnippet);

    return new Promise(async (resolve, reject) => {
      try {
        const argumentsObject = await getCssSnippet();
        const cssSnippet = argumentsObject.cssSnippet;
        resolve(cssSnippet);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function getJS(prompt) {
    const functionName = "returnJs";
    const functionDescription = "Returns the JavaScript for the given prompt to the user";
    const parameterJsSnippet = [
      "JS",
      "The JS code you want to return to the user"
    ];

    const getJsSnippet = createGptFunction(prompt, functionName, functionDescription);
    getJsSnippet.addParameter(...parameterJsSnippet);

    return new Promise(async (resolve, reject) => {
      try {
        const argumentsObject = await getJsSnippet();
        const jsSnippet = argumentsObject.jsSnippet;
        resolve(jsSnippet);
      } catch (error) {
        reject(error);
      }
    });
  }
});

export default siteRouter;