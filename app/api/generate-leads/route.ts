import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // إرسال الطلب من الخادم الآمن إلى السيرفر الألماني
    const backendResponse = await fetch('http://178.105.30.59:8000/api/generate-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { error: `خطأ من السيرفر الألماني: ${errorText}` },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء الاتصال بالسيرفر' },
      { status: 500 }
    );
  }
}