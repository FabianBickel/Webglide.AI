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
First think about what you need to include in the HTML with Bootstrap included and then the JS.
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

  console.log("GPT is creating Bootstrap...");
  const bootstrapResponseObject = await getBootstrap(messageThread);
  const bootstrap = bootstrapResponseObject.arguments.bootstrap;
  messageThread = bootstrapResponseObject.messages;
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
It's very important that you use \\n and never only use one backslash.
Make sure to follow ES6+ standards.`,
    messages,
    "returnJs",
    "Returns the JS for the planned site to the user",
    "js",
    "The code you want to return to the user"
  );
  return jsPromise;
}

function getBootstrap(messages) {
  const bootstrapPromise = getPromise(
    `You are now creating the bootstrap for the planned site.
Make sure the bootstrap works with the HTML you created.
To import bootstrap, use the following code: ' <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>'.
Make sure to format the JSON correctly and escape all characters necessary.
It's very important that you use \\n and never only use one backslash.
If you dont have an information, just fill it in with whatever you like.
Keep in mind that things like gradients, border radius and animations are very visually appealing and you should implement as much as possible.`,
    messages,
    "returnBootstrap",
    "Returns the Bootstrap for the planned site to the user",
    "bootstrap",
    "The code you want to return to the user"
  );
  return bootstrapPromise;
}

function getCombined(messages) {
  const combinedPromise = getPromise(
    `You are now combinging the html with bootstrap and javascript for the planned site.
Make sure the you don't forget any bootstrap attributes, implement all javascript features and style it as given. 
You have to put the JavaScript code into this file and not just a placeholder.
It's very important that everything is in this one HTML file you're creating. No external files. 
Make sure to format the JSON correctly and escape all characters necessary.
It's very important that you use \\n and never only use one backslash.
You are not allowed to write any comments in the code, only bare HTML including bootstrap and JavaScript code. If you see comments remove them but maybe keep in mind what they said.`,
    messages,
    "returnCombined",
    "Returns the combination of html, bootstrap and javascript for the planned site to the user",
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
