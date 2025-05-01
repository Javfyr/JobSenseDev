// pages/api/getAnalysis.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const apiKey = "up_q4SzgaQKW3DyDNb8U7p75W33XsWLd";
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.upstage.ai/v1/solar",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const prompt = `
You are an AI business analyst. Analyze this startup:

Company: JobSense
Team Size: 1-5
Stage: Pre-seed
Focus: AI/ML
Objective: Grow market share and improve product.

Give a list of skills they should develop, weaknesses they may have, and any suggestions for improvement.
`;

    const chatCompletion = await openai.chat.completions.create({
      model: "solar-1-mini-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    });

    const rawText = chatCompletion.choices?.[0]?.message?.content?.trim() || '';
    console.log("AI response:", rawText);

    res.status(200).json({ output: rawText });
  } catch (error) {
    console.error("Error in getAnalysis handler:", error);
    res.status(500).json({ error: 'Error generating analysis' });
  }
}
