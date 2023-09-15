"use strict"

export default class gptFunctionBuilder {

  #name;
  #description;
  #parameter;

  constructor(name, description) {
    this.#name = name;
    this.#description = description;
  }

  addParameter(name, description, type = "string") {
    this.#parameter = {
      "name": name,
      "type": type,
      "description": description
    };
  }

  build() {
    let properties = this.#buildProperties();

    const gptFunction = {
      "name": this.#name,
      "description": this.#description,
      "parameters": {
        "type": "object",
        "properties": properties,
        "required": Object.keys(properties)
      }
    };
    return gptFunction;
  }

  #buildProperties() {
    const propertyName = this.#parameter.name;
    const propertyType = this.#parameter.type;
    const propertyDescription = this.#parameter.description;
    
    let properties = {};
    properties[propertyName] = {
      "type": propertyType,
      "description": propertyDescription
    };
    return properties;
  }
}