import 'dotenv/config'
import { env } from 'node:process'

import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: env.API_KEY_OPENAI,
});