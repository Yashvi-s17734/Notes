// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend | null = null;

  // Verified sender for practice projects – emails deliver to real inboxes!
  private readonly FROM_EMAIL = 'Notes App <notes@onboarding.resend.dev>';


  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('RESEND_API_KEY missing. Email sending is disabled.');
      return;
    }

    this.resend = new Resend(apiKey);
    console.log('Resend initialized successfully');
  }

  private logError(error: any) {
    console.error('RESEND ERROR:', error);
  }

  // 1. Note Share Email
  async sendNoteShare(to: string, link: string, title: string) {
    if (!this.resend) {
      console.warn('Email not sent: Resend not initialized.');
      return;
    }

    try {
      console.log('📧 Sending Note Share email to:', to);

      await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: [to],
        subject: `Someone shared "${title}" with you`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h3 style="color: #333;">A note was shared with you</h3>
            <p><strong>${title}</strong></p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">Open Note</a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">Shared via Notes App</p>
          </div>
        `,
      });

      console.log(`Note share email sent to ${to}`);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  // 2. Share Notification Email
  async sendShareNotification(
    to: string,
    title: string,
    owner: string,
    permission: string,
    link: string,
  ) {
    if (!this.resend) {
      console.warn('Email not sent: Resend not initialized.');
      return;
    }

    const action = permission === 'edit' ? 'edit' : 'view';

    try {
      console.log('📧 Sending Share Notification to:', to);

      await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: [to],
        subject: `${owner} shared "${title}" with you`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h3 style="color: #333;">${owner} shared a note with you</h3>
            <p><strong>${title}</strong></p>
            <p>You can now <strong>${action}</strong> it.</p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">Open Note</a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">Shared via Notes App</p>
          </div>
        `,
      });

      console.log(`Share notification sent to ${to}`);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  // 3. Invitation Email
  async sendInvitationEmail(
    to: string,
    title: string,
    owner: string,
    inviteLink: string,
  ) {
    if (!this.resend) {
      console.warn('Email not sent: Resend not initialized.');
      return;
    }

    try {
      console.log('📧 Sending Invitation email to:', to);

      await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: [to],
        subject: `${owner} invited you to collaborate on "${title}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h3 style="color: #333;">You're invited to a note!</h3>
            <p><strong>${title}</strong></p>
            <p>${owner} has invited you to view and collaborate.</p>
            <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Accept Invitation</a>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 7 days. From Notes App.</p>
          </div>
        `,
      });

      console.log(`Invitation email sent to ${to}`);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}