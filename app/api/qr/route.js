import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, dark, light } = body;
    
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      color: {
        dark: dark || '#000000',
        light: light || '#ffffff'
      },
      scale: 8,
      margin: 2
    });

    return NextResponse.json({ qrCode: qrCodeDataUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
