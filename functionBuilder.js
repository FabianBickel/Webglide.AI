"use strict";

export default class functionBuilder {

  #name;
  #description;
  #parameters = {}; 

  constructor(name, description = "") {
    this.#name = name;
    this.#description = description;
  }

  addParameter(name, description, type = "string") {
    this.#parameters[name] = {
      "type": type,
      "description": description
    };
  }

  build() {
    const functionObject = {
      "name": this.#name,
      "description": this.#description,
      "parameters": {
        "type": "object",
        "properties": this.#parameters,
        "required": Object.keys(this.#parameters)
      }
    };

    return functionObject;
  }
}