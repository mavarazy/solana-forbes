import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const { email } = JSON.parse(request.body);
    if (!email) {
      throw new Error('Failed to parse email');
    }

    await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'X-MailerLite-ApiKey': process.env['MAILERLITE_EMAIL_TOKEN'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    response.status(200);
    response.send(JSON.stringify({ status: 'OK' }));
  } catch (err) {
    response.status(400);
  }
}
