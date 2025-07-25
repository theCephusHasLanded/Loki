import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Handle auth endpoints
    return res.status(200).json({ 
      message: 'Auth endpoint - under construction',
      success: false 
    });
  } else if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Auth profile endpoint - under construction',
      success: false 
    });
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}