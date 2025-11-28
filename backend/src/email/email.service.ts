import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials missing. Email disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendShareNotification(
    to: string,
    title: string,
    owner: string,
    permission: string,
    link: string,
  ) {
    if (!this.transporter) return;

    const action = permission === 'edit' ? 'edit' : 'view';

    await this.transporter.sendMail({
      from: `"Notes App" <${process.env.SMTP_USER}>`,
      to,
      subject: `${owner} shared "${title}" with you`,
      html: `
        <h3>${owner} shared a note with you</h3>
        <p><strong>${title}</strong></p>
        <p>You can now <strong>${action}</strong> it.</p>
        <a href="${link}" style="background:#facc15;color:black;padding:10px 20px;text-decoration:none;border-radius:8px;">Open Note</a>
      `,
    });
  }

  async sendInvitationEmail(
    to: string,
    title: string,
    owner: string,
    inviteLink: string,
  ) {
    if (!this.transporter) return;

    await this.transporter.sendMail({
      from: `"Notes App" <${process.env.SMTP_USER}>`,
      to,
      subject: `${owner} invited you to view "${title}"`,
      html: `
        <h3>You are invited to access a note</h3>
        <p><strong>${title}</strong></p>
        <a href="${inviteLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">Accept Invitation</a>
      `,
    });
  }
}
