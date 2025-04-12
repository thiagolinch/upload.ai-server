import 'dotenv/config'
import { env } from 'node:process'

import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: env.API_KEY_OPENAI,
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));