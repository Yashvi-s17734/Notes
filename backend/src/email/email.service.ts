// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
      const apiKey = process.env.RESEND_API_KEY;
  console.log("RESEND_KEY_LOADED:", apiKey ? "YES" : "NO");

  if (!apiKey) {
    console.warn("RESEND_API_KEY missing. Email sending is disabled.");
    return;
  }

  this.resend = new Resend(apiKey);
  }

  // 1. Send a note share email
  async sendNoteShare(to: string, link: string, title: string) {
    if (!this.resend) {
      console.warn('Email not sent: Resend not initialized.');
      return;
    }

    try {
      await this.resend.emails.send({
        from: 'Notes App <onboarding@resend.dev>', // ✅ FIXED
        to: [to],
        subject: `Someone shared "${title}" with you`,
        html: `
          <h3 style="color: #1f2937;">A note was shared with you</h3>
          <p><strong>${title}</strong></p>
          <p>You can now <strong>view</strong> it.</p>
          <br/>
          <a href="${link}" style="background:#facc15;color:black;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">
            Open Note
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:20px;">
            This link expires in 7 days.
          </p>
        `,
      });

      console.log(`Note share email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send note share email:', error);
      throw error;
    }
  }

  // 2. Notify a user they were given access to a note
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
      await this.resend.emails.send({
        from: 'Notes App <onboarding@resend.dev>', // ✅ FIXED
        to: [to],
        subject: `${owner} shared "${title}" with you`,
        html: `
          <h3 style="color: #1f2937;">${owner} shared a note with you</h3>
          <p><strong>${title}</strong></p>
          <p>You can now <strong>${action}</strong> it.</p>
          <br/>
          <a href="${link}" style="background:#facc15;color:black;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">
            Open Note
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:20px;">
            This link expires in 7 days.
          </p>
        `,
      });

      console.log(`Share notification sent to ${to}`);
    } catch (error) {
      console.error('Failed to send share notification:', error);
      throw error;
    }
  }

  // 3. Send invitation to view a note
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
      await this.resend.emails.send({
        from: 'Notes App <onboarding@resend.dev>', // ✅ FIXED
        to: [to],
        subject: `${owner} invited you to view "${title}"`,
        html: `
          <h3 style="color: #1f2937;">You are invited to access a note</h3>
          <p><strong>${title}</strong></p>
          <p>Click below to accept the invitation and view the note.</p>
          <br/>
          <a href="${inviteLink}" style="background:#4CAF50;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">
            Accept Invitation
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:20px;">
            This invitation expires in 7 days.
          </p>
        `,
      });

      console.log(`Invitation email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      throw error;
    }
  }
}
