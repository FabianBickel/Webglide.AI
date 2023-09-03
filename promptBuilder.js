"use strict";

import OpenAI from "openai";

const MODEL = "gpt-3.5-turbo-0613";
const CONTEXT = `
You are a web developer.
Your job is to create proofs of concept for the user, not to build out a fully fledged application.
Plan out your application step by step and use the provided functions to build it.
Make sure your framing is right and that your plan stays conservative and doesn't go overboard on complexity.
You have to add all the necessary imports and exports for internal or external stuff yourself.
`;

const openai = new OpenAI({ apiKey: "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" });

export default class promptBuilder {

  #prompt;
  #functions = [];

  get prompt() {
    return this.#prompt;
  }
  set prompt(prompt) {
    if (typeof prompt !== "string" || prompt === "") {
      throw new Error("The prompt must be a string");
    }
    this.#prompt = prompt;
  }
  get functions() {
    return this.#functions;
  }

  constructor(prompt) {
    this.#prompt = prompt;
  }

  addFunction(gptFunction) {

    checkInnerStructure(gptFunction);
    this.#functions.push(gptFunction);

    function checkInnerStructure(gptFunction) {
      if (typeof gptFunction !== "object") {
        throw new Error("The function must be an object");
      }
      if (!gptFunction.name || typeof gptFunction.name !== "string" || gptFunction.name === "") {
        throw new Error("The function must have a name");
      }
      if (!gptFunction.description || typeof gptFunction.description !== "string" || gptFunction.description === "") {
        throw new Error("The function must have a description");
      }
      if (!gptFunction.parameters || typeof gptFunction.parameters !== "object") {
        throw new Error("The function must have parameters");
      }
      if (!gptFunction.parameters.type
        || typeof gptFunction.parameters.type !== "string"
        || gptFunction.parameters.type === "") {
        throw new Error("The function must have a type");
      }
      if (!gptFunction.parameters.properties
        || typeof gptFunction.parameters.properties !== "object"
        || Object.keys(gptFunction.parameters.properties).length === 0) {
        throw new Error("The function must have properties");
      }
    }
  }

  build() {

    const completionPromise = openai.chat.completions.create({
      model: MODEL,
      messages: [
        { "role": "system", "content": CONTEXT },
        { "role": "user", "content": this.#prompt }
      ],
      functions: this.#functions,
    });

    return new Promise(async (resolve, reject) => {
      try {
        const completion = await completionPromise;
        const argumentsJsonString = completion
          .choices[0]
          .message
          .function_call
          .arguments;

        console.log(JSON.stringify(completion.choices))
        const argumentsObject = JSON.parse(argumentsJsonString);
        resolve(argumentsObject);
      } catch (error) {
        console.error(error);
        reject("GPT-3 did not finish properly");
      }
    });
  }
}