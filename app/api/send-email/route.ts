import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// تهيئة Resend بمفتاح الـ API
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to_email, subject, body, reply_to } = await request.json();

    const data = await resend.emails.send({
      from: 'Expora B2B <onboarding@resend.dev>', // استبدل هذا بإيميل الدومين الخاص بك بعد تفعيله في Resend
      to: to_email,
      reply_to: reply_to,
      subject: subject,
      text: body,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}