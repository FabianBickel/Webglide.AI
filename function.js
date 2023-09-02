"use strict";

import OpenAI from "openai";

const MODEL = "gpt-3.5-turbo-0613";
const CONTEXT =
  `You are a web developer. Your job is it to do `;

const openai = new OpenAI({ apiKey: "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" });

export default function createGPTFunction(prompt, name, description = "") {

  const instance = async function () {
    const gptFunction = {
      "name": name,
      "description": description,
      "parameters": {
        "type": "object",
        "properties": instance.functionParameters,
        "required": Object.keys(instance.functionParameters)
      }
    };

    const functions = [gptFunction];

    console.log(JSON.stringify(functions));

    const completionPromise = openai.chat.completions.create({
      model: MODEL,
      messages: [
        { "role": "system", "content": CONTEXT },
        { "role": "user", "content": prompt }
      ],
      functions: functions,
      function_call: { "name": name }
    });

    return new Promise(async (resolve, reject) => {
      try {
        const completion = await completionPromise;
        const argumentsJsonString = completion
          .choices[0]
          .message
          .function_call
          .arguments;
        const argumentsObject = JSON.parse(argumentsJsonString);
        resolve(argumentsObject);
      } catch (error) {
        console.error(error);
        reject("GPT-3 did not finish properly");
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
};