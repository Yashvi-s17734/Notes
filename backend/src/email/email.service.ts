// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend | null = null;

  // CHANGE THIS TO YOUR ACTUAL .resend.dev DOMAIN (check: https://resend.com/domains)
  private readonly FROM_EMAIL = 'Notes App <hello@yashvipshah80.resend.dev>'; // ← UPDATE THIS!

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
      console.log('Sending Note Share email to:', to);

      await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: [to],
        subject: `Someone shared "${title}" with you`,
        html: `
          <h3>A note was shared with you</h3>
          <p><strong>${title}</strong></p>
          <p><a href="${link}" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">Open Note</a></p>
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
    if (!this.resend) return;

    const action = permission === 'edit' ? 'edit' : 'view';

    try {
      console.log('Sending Share Notification to:', to);

      await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: [to],
        subject: `${owner} shared "${title}" with you`,
        html: `
          <h3>${owner} shared a note with you</h3>
          <p><strong>${title}</strong></p>
          <p>You now have permission to <strong>${action}</strong> this note.</p>
          <p><a href="${link}" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">Open Note</a></p>
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
    if (!this.resend) return;

    try {
      console.log('Sending Invitation email to:', to);

      await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: [to],
        subject: `${owner} invited you to collaborate on "${title}"`,
        html: `
          <h3>You're invited to a note!</h3>
          <p><strong>${title}</strong></p>
          <p>${owner} has invited you to view and collaborate.</p>
          <p><a href="${inviteLink}" style="padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Accept Invitation</a></p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 7 days.</p>
        `,
      });

      console.log(`Invitation email sent to ${to}`);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}