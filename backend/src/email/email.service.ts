// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    console.log('RESEND_KEY_LOADED:', apiKey ? 'YES' : 'NO');

    if (!apiKey) {
      console.warn('RESEND_API_KEY missing. Email sending is disabled.');
      return;
    }

    this.resend = new Resend(apiKey);

    console.log('RESEND KEY LOADED:', !!process.env.RESEND_API_KEY);
    console.log('RESEND KEY VALUE:', process.env.RESEND_API_KEY);
  }

  // COMMON ERROR LOGGING HANDLER
  private logError(error: any) {
    console.error('🔥 RESEND ERROR FULL:', JSON.stringify(error, null, 2));
    console.error('🔥 RESEND ERROR RAW:', error);
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
        from: 'Notes App <onboarding@resend.dev>',
        to: [to],
        subject: `Someone shared "${title}" with you`,
        html: `
          <h3>A note was shared with you</h3>
          <p><strong>${title}</strong></p>
          <a href="${link}">Open Note</a>
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
        from: 'Notes App <onboarding@resend.dev>',
        to: [to],
        subject: `${owner} shared "${title}" with you`,
        html: `
          <h3>${owner} shared a note with you</h3>
          <p><strong>${title}</strong></p>
          <p>You can now <strong>${action}</strong> it.</p>
          <a href="${link}">Open Note</a>
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
        from: 'Notes App <onboarding@resend.dev>',
        to: [to],
        subject: `${owner} invited you to view "${title}"`,
        html: `
          <h3>You are invited to access a note</h3>
          <p><strong>${title}</strong></p>
          <a href="${inviteLink}">Accept Invitation</a>
        `,
      });

      console.log(`Invitation email sent to ${to}`);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}
