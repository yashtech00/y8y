// npm install @langchain-anthropic
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";

import { z } from "zod";

const sum = tool(
  async (input) => {
    console.log("sum tool called");
    return input.a + input.b;
  },
  {
    name: "sum",
    description: "Call to sum two numbers.",
    schema: z.object({
      a: z.number().describe("The first number to add."),
      b: z.number().describe("The second number to add."),
    }),
  }
);


const multiply = tool(
  async (input) => {
    console.log("multiply tool called");
    return input.a * input.b;
  },
  {
    name: "multiply",
    description: "Call to multiply two numbers.",
    schema: z.object({
      a: z.number().describe("The first number to multiply."),
      b: z.number().describe("The second number to multiply."),
    }),
  }
);

const exponent = tool(
  async (input) => {
    console.log("exponent tool called");
    return input.a ** input.b;
  },
  {
    name: "exponent",
    description: "Finds power of a number to a given number.",
    schema: z.object({
      a: z.number().describe("The number to find the power of."),
      b: z.number().describe("The power to raise the number to."),
    }),
  }
);


// Initialize the model with tools
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
});

const agent = createReactAgent({
  llm: model,
  tools: [sum, multiply, exponent],
});

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "First calculate 3 + 4, then multiply the result by 2, then raise it to the power of 2",
    },
  ],
});

console.log(result,"yash");
