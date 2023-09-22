"use strict";

import OpenAI from "openai";
import checkForUndefined from "./checkForUndefined.js";
import { config } from "dotenv";

config();

const MODEL = "gpt-3.5-turbo-16k";
const CONTEXT = `
You are a web developer.
Your job is it to do what the customer tells you to do.
`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default class gptPrompt {
  #messages;
  #gptFunction;

  set messages(messages) {
    checkForUndefined(messages);
    this.#messages = messages;
  }

  constructor(messages = []) {
    this.#messages = messages;
  }

  addContext(context) {
    checkForUndefined(context);
    this.#messages.unshift({ role: "system", content: context });
  }

  addGptFunction(gptFunction) {
    checkForUndefined(gptFunction);
    this.#gptFunction = gptFunction;
  }

  addMessage(message) {
    checkForUndefined(message);
    if (this.#messages.length !== 0) {
      this.#messages.push({ role: "user", content: message });
      return;
    }
    this.#messages.push({ role: "system", content: CONTEXT });
    this.#messages.push({ role: "user", content: message });
  }

  send() {
    const promptObject = this.#buildPromptObject(
      this.#messages,
      this.#gptFunction
    );
    const completionPromise = openai.chat.completions.create(promptObject);

    return new Promise(async (resolve, reject) => {
      try {
        const responseObject = resolveCompletion(
          completionPromise,
          this.#messages,
          this.#gptFunction
        );
        resolve(responseObject);
      } catch (error) {
        reject(error);
      }
    });
  }

  #buildPromptObject(messages = [], gptFunction = undefined) {
    const promptObject = {
      model: MODEL,
      messages: messages,
    };

    if (gptFunction) {
      promptObject.functions = [gptFunction];
      promptObject.function_call = { name: gptFunction.name };
    }

    return promptObject;
  }
}

async function resolveCompletion(
  completionPromise,
  messages = [],
  gptFunction = undefined
) {
  const completion = await completionPromise;
  console.log(JSON.stringify(completion, null, 2));

  let responseObject = {
    messages: messages,
  };

  if (gptFunction === undefined) {
    const message = getResponseMessageObject(completion);
    responseObject.messages.push(message);
    responseObject.response = message.content;
  } else {
    responseObject.arguments = getArgumentsObject(completion);
    const argumentName = Object.keys(responseObject.arguments)[0];
    const argumentContent = responseObject.arguments[argumentName];
    responseObject.response = argumentContent;
    responseObject.messages.push({ role: "user", content: argumentContent });
  }

  return responseObject;
}

function getResponseMessageObject(completion) {
  const messageObject = {
    role: "assistant",
    content: completion.choices[0].message.content,
  };
  return messageObject;
}

function getArgumentsObject(completion) {
  const argumentsJsonString =
    completion.choices[0].message.function_call.arguments;
  const argumentsObject = JSON.parse(argumentsJsonString);
  return argumentsObject;
}
