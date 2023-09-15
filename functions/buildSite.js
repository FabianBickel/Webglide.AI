"use strict";

import gptFunctionBuilder from "./gptFunction.js";
import gptPrompt from "./gptPrompt.js";

export default function buildSite(prompt) {
  const sitePromise = new Promise(async (resolve, reject) => {
    try {
      const webPage = await resolvePrompt(prompt);
      resolve(webPage);
    } catch (error) {
      reject(error);
    }
  });
  return sitePromise;
}

async function resolvePrompt(prompt) {
  const context = `
You are a web developer, building ready-to-use web applications for customers.
You plan out your work by writing down the steps you need to take to complete the task.
First think about what you need to include in the HTML, then the JS, then the CSS.
`;

  const planningPrompt = new gptPrompt();
  planningPrompt.addContext(context);
  planningPrompt.addMessage(prompt);
  const planningPromise = planningPrompt.send();

  console.log("GPT is planning site...");
  const planningResponseObject = await planningPromise;
  let messageThread = planningResponseObject.messages;
  console.log("Done!");

  console.log("GPT is creating HTML...");
  const htmlResponseObject = await getHtml(messageThread);
  const html = htmlResponseObject.arguments.html;
  messageThread = htmlResponseObject.messages;
  console.log("Done!");

  console.log("GPT is creating JS...");
  const jsResponseObject = await getJs(messageThread);
  const js = jsResponseObject.arguments.js;
  messageThread = jsResponseObject.messages;
  console.log("Done!");

  console.log("GPT is creating CSS...");
  const cssResponseObject = await getCss(messageThread);
  const css = cssResponseObject.arguments.css;
  messageThread = cssResponseObject.messages;
  console.log("Done!");

  const webPage = { html, css, js };
  return webPage;
}

function getHtml(messages) {
  const htmlPromise = getPromise(
    `You are now creating the HTML for the planned site.
Create an entire, working HTML page with a head and body.`,
    messages,
    "returnHtml",
    "Returns the HTML for the planned site to the user",
    "html",
    "The code you want to return to the user"
  );
  return htmlPromise;
}

function getJs(messages) {
  const jsPromise = getPromise(
    `You are now creating the JS for the planned site.
Make sure the JS works with the HTML you created.`,
    messages,
    "returnJs",
    "Returns the JS for the planned site to the user",
    "js",
    "The code you want to return to the user"
  );
  return jsPromise;
}

function getCss(messages) {
  const cssPromise = getPromise(
    `You are now creating the CSS for the planned site.
Make sure the CSS works with the HTML you created.`,
    messages,
    "returnCss",
    "Returns the CSS for the planned site to the user",
    "css",
    "The code you want to return to the user"
  );
  return cssPromise;
}

function getPromise(
  prompt,
  messages,
  functionName,
  functionDescription,
  parameterName,
  parameterDescription
) {

  const promptBuilder = new gptPrompt();
  promptBuilder.messages = messages;
  promptBuilder.addMessage(prompt);
  const functionBuilder = new gptFunctionBuilder(functionName, functionDescription);
  functionBuilder.addParameter(parameterName, parameterDescription);
  const htmlFunction = functionBuilder.build();
  promptBuilder.addGptFunction(htmlFunction);
  const promise = promptBuilder.send();

  return promise;

}