import type { NextApiRequest, NextApiResponse } from 'next';

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  role?: string;
}

interface RegisterResponse {
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
  res: NextApiResponse<RegisterResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { 
    email, 
    password, 
    firstName, 
    lastName, 
    company, 
    role 
  }: RegisterRequest = req.body;

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email, password, first name, and last name are required' 
    });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  // For demo purposes, accept any registration
  // In production, this would save to a database
  const user = {
    id: `user_${Date.now()}`,
    email,
    name: `${firstName} ${lastName}`,
    role: role || 'Trader',
    company: company || 'Demo Institution'
  };

  // In production, you'd generate a real JWT token
  const demoToken = `demo_token_${user.id}`;

  return res.status(201).json({
    success: true,
    user,
    token: demoToken
  });
}
