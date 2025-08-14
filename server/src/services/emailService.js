// server/src/services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT) || 1025,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });
  }

  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@campusconnect.com',
        to,
        subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to CampusConnect!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to CampusConnect!</h1>
        <p>Hi ${user.firstName},</p>
        <p>Welcome to CampusConnect, your gateway to amazing career opportunities!</p>
        <p>Your account has been successfully created. You can now:</p>
        <ul>
          <li>Browse and apply for jobs</li>
          <li>Build and manage your resume</li>
          <li>Register for campus events</li>
          <li>Track your applications</li>
        </ul>
        <p>Get started by completing your profile to get better job recommendations.</p>
        <a href="${process.env.FRONTEND_URL}/profile" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Complete Your Profile
        </a>
        <p>Best regards,<br>The CampusConnect Team</p>
      </div>
    `;
    const text = `Welcome to CampusConnect! Complete your profile at ${process.env.FRONTEND_URL}/profile`;

    return this.sendEmail(user.email, subject, html, text);
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Reset Your Password - CampusConnect';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>You requested a password reset for your CampusConnect account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The CampusConnect Team</p>
      </div>
    `;
    const text = `Reset your password: ${resetUrl}`;

    return this.sendEmail(email, subject, html, text);
  }

  async sendApplicationStatusUpdate(application, newStatus) {
    const user = application.student;
    const job = application.job;
    const company = job.organization;

    const statusMessages = {
      shortlisted: 'Congratulations! Your application has been shortlisted.',
      interviewed: 'Your interview has been scheduled.',
      selected: 'Congratulations! You have been selected for the position.',
      rejected: 'Thank you for your interest. We have decided to move forward with other candidates.'
    };

    const subject = `Application Update: ${job.title} at ${company.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Application Status Update</h1>
        <p>Hi ${user.firstName},</p>
        <p>Your application for <strong>${job.title}</strong> at <strong>${company.name}</strong> has been updated.</p>
        <p><strong>Status:</strong> ${newStatus.toUpperCase()}</p>
        <p>${statusMessages[newStatus] || 'Your application status has been updated.'}</p>
        ${application.feedback ? `<p><strong>Feedback:</strong> ${application.feedback}</p>` : ''}
        <a href="${process.env.FRONTEND_URL}/applications" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          View Applications
        </a>
        <p>Best regards,<br>The CampusConnect Team</p>
      </div>
    `;
    const text = `Your application for ${job.title} at ${company.name} status: ${newStatus}`;

    return this.sendEmail(user.email, subject, html, text);
  }

  async sendNewJobAlert(user, job) {
    const company = job.organization;
    const subject = `New Job Alert: ${job.title} at ${company.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Job Opportunity!</h1>
        <p>Hi ${user.firstName},</p>
        <p>A new job that matches your profile has been posted:</p>
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h2 style="margin: 0 0 8px 0; color: #1f2937;">${job.title}</h2>
          <p style="margin: 0 0 8px 0; color: #6b7280;">${company.name}</p>
          <p style="margin: 0 0 8px 0;">${job.location}</p>
          <p style="margin: 0;">${job.description.substring(0, 200)}...</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/jobs/${job.id}" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          View Job Details
        </a>
        <p>Best regards,<br>The CampusConnect Team</p>
      </div>
    `;
    const text = `New job: ${job.title} at ${company.name}. View at ${process.env.FRONTEND_URL}/jobs/${job.id}`;

    return this.sendEmail(user.email, subject, html, text);
  }

  async sendEventReminder(user, event) {
    const eventDate = new Date(event.startTime).toLocaleDateString();
    const eventTime = new Date(event.startTime).toLocaleTimeString();
    
    const subject = `Event Reminder: ${event.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Event Reminder</h1>
        <p>Hi ${user.firstName},</p>
        <p>This is a reminder for the upcoming event you registered for:</p>
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h2 style="margin: 0 0 8px 0; color: #1f2937;">${event.title}</h2>
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${eventDate}</p>
          <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${eventTime}</p>
          <p style="margin: 0 0 8px 0;"><strong>Location:</strong> ${event.location}</p>
          ${event.virtualLink ? `<p style="margin: 0 0 8px 0;"><strong>Virtual Link:</strong> <a href="${event.virtualLink}">Join Event</a></p>` : ''}
        </div>
        <p>Don't forget to attend!</p>
        <a href="${process.env.FRONTEND_URL}/events/${event.id}" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          View Event Details
        </a>
        <p>Best regards,<br>The CampusConnect Team</p>
      </div>
    `;
    const text = `Event reminder: ${event.title} on ${eventDate} at ${eventTime}`;

    return this.sendEmail(user.email, subject, html, text);
  }
}

module.exports = new EmailService();
