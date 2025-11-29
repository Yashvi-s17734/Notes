// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend | null = null;

  private readonly FROM_EMAIL = 'Notes App <notes@onboarding.resend.dev>';

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('RESEND_API_KEY missing. Email disabled.');
      return;
    }

    this.resend = new Resend(apiKey);
    console.log('Resend initialized successfully');
  }

  private async safeSend(payload: any) {
    if (!this.resend) return;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`📨 Attempt ${attempt} sending email → Resend`);
        const response = await this.resend.emails.send(payload);

        console.log("📨 RESEND RESPONSE:", JSON.stringify(response, null, 2));
        return response;
      } catch (error: any) {
        console.error(`❌ RESEND ERROR (attempt ${attempt}):`, error.message);
        if (attempt === 3) throw error;
        await new Promise(res => setTimeout(res, 800)); // wait 0.8 sec then retry
      }
    }
  }

  // 1. Note Share Email
  async sendNoteShare(to: string, link: string, title: string) {
    console.log('📧 Sending Note Share email to:', to);

    return this.safeSend({
      from: this.FROM_EMAIL,
      to: [to],
      subject: `Someone shared "${title}" with you`,
      html: `
      <div>
        <h3>A note was shared with you</h3>
        <p><strong>${title}</strong></p>
        <a href="${link}">Open Note</a>
      </div>
      `,
    });
  }

  // 2. Share Notification Email
  async sendShareNotification(
    to: string,
    title: string,
    owner: string,
    permission: string,
    link: string,
  ) {
    console.log('📧 Sending Share Notification to:', to);

    const action = permission === 'edit' ? 'edit' : 'view';

    return this.safeSend({
      from: this.FROM_EMAIL,
      to: [to],
      subject: `${owner} shared "${title}" with you`,
      html: `
      <div>
        <h3>${owner} shared a note with you</h3>
        <p>You can now <strong>${action}</strong> it.</p>
        <a href="${link}">Open Note</a>
      </div>
      `,
    });
  }

  // 3. Invitation Email
  async sendInvitationEmail(
    to: string,
    title: string,
    owner: string,
    inviteLink: string,
  ) {
    console.log('📧 Sending Invitation email to:', to);

    return this.safeSend({
      from: this.FROM_EMAIL,
      to: [to],
      subject: `${owner} invited you to collaborate on "${title}"`,
      html: `
      <div>
        <h3>You're invited!</h3>
        <p><strong>${title}</strong></p>
        <a href="${inviteLink}">Accept Invitation</a>
      </div>
      `,
    });
  }
}
