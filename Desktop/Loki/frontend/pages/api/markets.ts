import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Markets endpoint - under construction',
      markets: []
    });
  } else if (req.method === 'POST') {
    return res.status(200).json({ 
      message: 'Create market endpoint - under construction',
      success: false 
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}