// ai/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('No api key found');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
