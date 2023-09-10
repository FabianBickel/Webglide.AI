"use strict";

import OpenAI from "openai";

const MODEL = "gpt-3.5-turbo-0613";
const CONTEXT =`
You are a web developer.
Your job is it to do what the customer tells you to do.
`;

const openai = new OpenAI({ apiKey: "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" });

export default function createGptFunction(prompt, name, description = "") {

  const instance = async function () {
    const gptFunctionObject = buildGptFunctionObject(name, description, instance.functionParameters);
    // console.log("---FUNCTIONOBJECT---\n\n" + JSON.stringify(gptFunctionObject, null, 2) + "\n\n");
    const promptObject = buildPromptObject(prompt, gptFunctionObject);
    // console.log("---PROMPTOBJECT---\n\n" + JSON.stringify( promptObject, null, 2) + "\n\n");
    const completionPromise = openai.chat.completions.create(promptObject);

    return new Promise(async (resolve, reject) => {
      try {
        const completion = await completionPromise;
        const argumentsJsonString = completion
          .choices[0]
          .message
          .function_call
          .arguments;
        const argumentsObject = JSON.parse(argumentsJsonString);
        // console.log("---ARGUMENTS---\n\n" + JSON.stringify(argumentsObject, null, 2) + "\n\n");
        resolve(argumentsObject);
      } catch (error) {
        reject(error);
      }
    });
  };

  instance.functionParameters = {};
  instance.addParameter = function (name, description, type = "string") {
    instance.functionParameters[name] = {
      "type": type,
      "description": description
    };
  };

  return instance;

  function buildGptFunctionObject(name, description, parameters) {
    const gptFunction = {
      "name": name,
      "description": description,
      "parameters": {
        "type": "object",
        "properties": parameters,
        "required": Object.keys(parameters)
      }
    };
    return gptFunction
  }

  function buildPromptObject(prompt, gptFunction) {
    const promptObject = {
      model: MODEL,
      messages: [
        { "role": "system", "content": CONTEXT },
        { "role": "user", "content": prompt }
      ],
      functions: [gptFunction],
      function_call: { "name": gptFunction.name }
    };

    return promptObject;
  }
};