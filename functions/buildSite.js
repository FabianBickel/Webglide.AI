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
You plan out your work by writing down the features you need to take to complete the task so a human could understand exactly what he has to do.
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

  console.log("GPT is combining code...");
  const combinedResponseObject = await getCombined(messageThread);
  const combined = combinedResponseObject.arguments.combined;
  messageThread = combinedResponseObject.messages;
  console.log("Done!");

  const webPage = { combined };
  return webPage;
}

function getHtml(messages) {
  const htmlPromise = getPromise(
    `You are now creating the HTML for the planned site.
Create an entire, working HTML page. 
Make sure to format the JSON correctly and escape all characters necessary.
Do not do any whitespace.
If you dont have an information, just fill it in with whatever you like.
It's very important that if you want to do a backspace, use \\n and never only use one backslash..`,
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
Make sure the JS works with the HTML you created.
You have to create all the features with JavaScript, you are not allowed to make any placeholder text.
Make sure to format the JSON correctly and escape all characters necessary.
Do not do any whitespace.
It's very important that you use \\n and never only use one backslash.`,
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
Make sure the CSS works with the HTML you created.
Make sure to format the JSON correctly and escape all characters necessary.
It's very important that you use \\n and never only use one backslash.
If you dont have an information, just fill it in with whatever you like.`,
    messages,
    "returnCss",
    "Returns the CSS for the planned site to the user",
    "css",
    "The code you want to return to the user"
  );
  return cssPromise;
}

function getCombined(messages) {
  const combinedPromise = getPromise(
    `You are now combinging the html, css and javascript for the planned site.
Make sure the you don't forget any css attributes, implement all javascript features and style it as given. 
You have to put the JavaScript and CSS code into this file and not just a placeholder.
It's very important that everything is in this one HTML file you're creating. No external files. 
Make sure to format the JSON correctly and escape all characters necessary.
It's very important that you use \\n and never only use one backslash.
You are not allowed to write any comments in the code, only bare HTML, CSS and JavaScript code. If you see comments remove them but maybe keep in mind what they said.`,
    messages,
    "returnCombined",
    "Returns the combination of html, css and javascript for the planned site to the user",
    "combined",
    "The code you want to return to the user"
  );
  return combinedPromise;
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
  const functionBuilder = new gptFunctionBuilder(
    functionName,
    functionDescription
  );
  functionBuilder.addParameter(parameterName, parameterDescription);
  const htmlFunction = functionBuilder.build();
  promptBuilder.addGptFunction(htmlFunction);
  const promise = promptBuilder.send();

  return promise;
}
