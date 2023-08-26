import express from "express";
import OpenAI from 'openai';

const app = express();
app.use(express.json());

const conf = {
  apiKey: "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"
};
const openai = new OpenAI(conf);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/htmlSnippet", async (request, response) => {
  const prompt = request.body.prompt;
  console.log(`Received request for HTML: ${prompt}`);

  const functions = [
    {
      "name": "returnHtmlSnippet",
      "description": "Returns the HTML snippet for the given prompt to the user",
      "parameters": {
        "type": "object",
        "properties": {
          "htmlSnippet": {
            "type": "string",
            "description": "The HTML snippet to return to the user"
          }
        },
        "required": ["htmlSnippet"]
      }
    }
  ];

  const completionPromise = openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      { "role": "user", "content": prompt }
    ],
    functions: functions,
    function_call: { "name": "returnHtmlSnippet" }
  });

  const completion = await completionPromise;
  console.log(completion.choices[0].message.function_call);
  const result = JSON.parse(
    completion
      .choices[0]
      .message
      .function_call
      .arguments);
  console.log(result);

  response.status(200).json(result);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});