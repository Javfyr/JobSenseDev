import { NextApiRequest, NextApiResponse } from 'next';
import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { resumeText } = req.body;

  if (!resumeText || typeof resumeText !== 'string') {
    return res.status(400).json({ error: 'Resume text is required' });
  }

  const prompt = `Based on the person's current role and experience as described in their resume below, return ONLY the next logical higher role with a maximum of 4 words. Do not include any additional text, explanations, or formatting. Only return the role title.

Here is their current resume:

${resumeText}`;

  const command = new InvokeModelWithResponseStreamCommand({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.3,
    }),
  });

  try {
    const response = await bedrockClient.send(command);

    let fullResponse = '';

    if (!response.body) {
      throw new Error('Response body is undefined');
    }

    for await (const chunk of response.body) {
      const text = new TextDecoder().decode(chunk.chunk?.bytes);
      if (text) {
        const parsed = JSON.parse(text);
        fullResponse += parsed.delta?.text || '';
      }
    }

    const roleTitle = fullResponse.trim();

    if (!roleTitle || roleTitle.split(/\s+/).length > 4) {
      return res
        .status(400)
        .json({ error: 'Invalid or overly long role title generated' });
    }

    return res.status(200).json({ roleTitle });
  } catch (error) {
    console.error(`ERROR: Can't invoke AWS Claude 3. Reason:`, error);
    return res.status(500).json({ error: 'Failed to invoke model' });
  }
}
