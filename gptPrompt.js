"use strict";

import OpenAI from "openai";
import checkForUndefined from "./checkForUndefined.js";
import { response } from "express";

const MODEL = "gpt-3.5-turbo-0613";
const CONTEXT = `
You are a web developer.
Your job is it to do what the customer tells you to do.
You plan out your work by writing down the steps you need to take to complete the task.
`;

const openai = new OpenAI({ apiKey: "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" });

export default class gptPrompt {

  #prompt;
  #messages;
  #gptFunction;

  constructor(prompt, messages = []) {
    checkForUndefined(prompt);
    this.#prompt = prompt;
    this.#messages = messages;
  }

  addGptFunction(gptFunction) {
    checkForUndefined(gptFunction);
    this.#gptFunction = gptFunction;
  }

  send() {
    const promptObject = this.#buildPromptObject(this.#prompt, this.#messages, this.#gptFunction);
    const completionPromise = openai.chat.completions.create(promptObject);

    return new Promise(async (resolve, reject) => {
      try {
        const responseObject =
          resolveCompletion(
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

  #buildPromptObject(prompt, messages = [], gptFunction = undefined) {
    this.#addMessage(prompt);
    
    const promptObject = {
      model: MODEL,
      messages: messages,
    };

    if (gptFunction) {
      promptObject.functions = [gptFunction];
      promptObject.function_call = { "name": gptFunction.name };
    }

    return promptObject;
  }

  #addMessage(prompt) {
    if (this.#messages === []) {
      this.#messages.push({ "role": "system", "content": CONTEXT });
    }
    this.#messages.push({ "role": "user", "content": prompt });
  }
}

async function resolveCompletion(completionPromise, messages = [], gptFunction = undefined) {
  const completion = await completionPromise;

  let responseObject = {
    messages: messages
  };

  if (gptFunction === undefined) {
    const message = getResponseMessageObject(completion);
    responseObject.messages.push(message);
    responseObject.response = message.content;
  } else {
    responseObject.arguments = getArgumentsObject(completion);
    const argumentContent = responseObject.arguments[Object.keys(gptFunction.parameters)[0]];
    responseObject.response = argumentContent;
    responseObject.messages.push(argumentContent);
  }

  return responseObject;
}

function getResponseMessageObject(completion) {
  const messageObject = {
    "role": "assistant",
    "content": completion.choices[0].message.content
  };
  return messageObject;
}


function getArgumentsObject(completion) {
  const argumentsJsonString = completion
    .choices[0]
    .message
    .function_call
    .arguments;
  const argumentsObject = JSON.parse(argumentsJsonString);
  return argumentsObject;
}
