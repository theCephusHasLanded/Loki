import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
    company?: string;
  };
  token?: string;
  message?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { email, password }: LoginRequest = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  // For demo purposes, accept any email/password combination
  // In production, this would validate against a database
  if (email && password) {
    const user = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: 'Trader',
      company: 'Demo Institution'
    };

    // In production, you'd generate a real JWT token
    const demoToken = `demo_token_${user.id}`;

    return res.status(200).json({
      success: true,
      user,
      token: demoToken
    });
  }

  return res.status(401).json({ 
    success: false, 
    message: 'Invalid credentials' 
  });
}
