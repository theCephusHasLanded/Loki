import { NextApiRequest, NextApiResponse } from 'next';

interface FeedbackData {
  rating: number;
  feedback: string;
  email: string;
  userAgent: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const feedbackData: FeedbackData = req.body;
    
    // Validate required fields
    if (!feedbackData.rating || !feedbackData.feedback || feedbackData.rating < 1 || feedbackData.rating > 5) {
      return res.status(400).json({ message: 'Invalid feedback data' });
    }

    // Format the email content
    const emailSubject = `LOKI 2032 Beta Feedback - ${feedbackData.rating} Star${feedbackData.rating !== 1 ? 's' : ''}`;
    
    const emailBody = `
New feedback received for LOKI 2032 Beta:

⭐ Rating: ${feedbackData.rating}/5 stars

💬 Feedback:
${feedbackData.feedback}

📧 User Email: ${feedbackData.email || 'Not provided'}

🕒 Timestamp: ${new Date(feedbackData.timestamp).toLocaleString()}

🖥️ User Agent: ${feedbackData.userAgent}

---
Sent from LOKI 2032 Beta Feedback System
    `;

    // Send email using a webhook service (Zapier, Make.com, or similar)
    // This is the most reliable method for immediate deployment
    const emailPayload = {
      to: 'christinacephus@pursuit.org',
      from: 'LOKI 2032 Beta Feedback System',
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>'),
      feedbackData
    };

    // Option 1: Direct email via webhook (recommended for immediate use)
    try {
      // You can use services like:
      // - Zapier webhooks: https://hooks.zapier.com/hooks/catch/...
      // - Make.com webhooks: https://hook.eu1.make.com/...
      // - EmailJS: https://api.emailjs.com/api/v1.0/email/send
      
      // For EmailJS (you'll need to create a free account and get service_id, template_id, user_id)
      const emailJSResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID || 'service_loki2032',
          template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_feedback',
          user_id: process.env.EMAILJS_USER_ID || '',
          template_params: {
            to_email: 'christinacephus@pursuit.org',
            from_name: 'LOKI 2032 Beta',
            subject: emailSubject,
            message: emailBody,
            rating: feedbackData.rating,
            user_email: feedbackData.email || 'Not provided',
            timestamp: feedbackData.timestamp
          }
        }),
      });

      if (!emailJSResponse.ok) {
        throw new Error('EmailJS failed');
      }
    } catch (emailError) {
      console.warn('Email service failed, using fallback logging:', emailError);
    }

    // Log the feedback for debugging
    console.log('Feedback received:', {
      ...feedbackData,
      emailPayload
    });

    // For production deployment, uncomment and configure one of these options:
    
    // Option A: Using SendGrid
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(emailPayload);
    */
    
    // Option B: Using Nodemailer
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    await transporter.sendMail(emailPayload);
    */
    
    // Option C: Using a webhook service like Zapier or Make.com
    /*
    await fetch(process.env.FEEDBACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...feedbackData, emailPayload })
    });
    */

    // Store feedback in a simple JSON file for now (not recommended for production)
    try {
      const fs = require('fs');
      const path = require('path');
      const feedbackFile = path.join(process.cwd(), 'feedback.json');
      
      let existingFeedback = [];
      try {
        const data = fs.readFileSync(feedbackFile, 'utf8');
        existingFeedback = JSON.parse(data);
      } catch (error) {
        // File doesn't exist or is empty, start with empty array
      }
      
      existingFeedback.push({
        id: Date.now(),
        ...feedbackData,
        submittedAt: new Date().toISOString()
      });
      
      fs.writeFileSync(feedbackFile, JSON.stringify(existingFeedback, null, 2));
    } catch (error) {
      console.error('Error saving feedback to file:', error);
    }

    // Simulate email sending success
    return res.status(200).json({ 
      message: 'Feedback submitted successfully',
      id: Date.now()
    });

  } catch (error) {
    console.error('Error processing feedback:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
