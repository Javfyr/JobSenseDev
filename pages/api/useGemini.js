import AWS from 'aws-sdk';

/* ------------------------------------------------------------------ */
/* Basic SageMaker Runtime setup                                      */
/* ------------------------------------------------------------------ */
console.log('Using endpoint:', process.env.SAGEMAKER_ENDPOINT_NAME);

const sagemakerRuntime = new AWS.SageMakerRuntime({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/* ------------------------------------------------------------------ */
/* Simple API handler                                                 */
/* ------------------------------------------------------------------ */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { resume, skills } = req.body;

  if (!resume || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const payload = JSON.stringify({ resume, skills });

    const response = await sagemakerRuntime
      .invokeEndpoint({
        EndpointName: process.env.SAGEMAKER_ENDPOINT_NAME,
        Body: payload,
        ContentType: 'application/json',
        Accept: 'application/json',
      })
      .promise();

    const result = JSON.parse(Buffer.from(response.Body).toString());

    return res.status(200).json(result);
  } catch (error) {
    console.error('[SageMaker Error]', error);
    return res.status(500).json({
      error: 'Failed to invoke model',
      details: error.message,
    });
  }
}
