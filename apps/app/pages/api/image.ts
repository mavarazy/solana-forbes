import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { url } = request.query;

  if (!url) {
    response.status(404);
    return;
  }

  const res = await fetch(url as string);
  if (res.ok) {
    response.send(res.body);
  }
  // response.end(`Hello ${url}!`);
}
