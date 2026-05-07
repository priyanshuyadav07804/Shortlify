import { NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import clientPromise from '../../../lib/mongodb';

export async function POST(req) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: 'MongoDB URI not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { originalUrl } = body;

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('shortlify');
    const collection = db.collection('urls');

    const existing = await collection.findOne({ originalUrl });
    if (existing) {
      return NextResponse.json(existing);
    }

    // Generate unique short code
    let shortCode;
    let isUnique = false;
    
    while (!isUnique) {
      // 6 characters base64url encoded
      shortCode = crypto.randomBytes(4).toString('base64url').substring(0, 6);
      const existingCode = await collection.findOne({ shortCode });
      if (!existingCode) {
        isUnique = true;
      }
    }

    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.APP_URL || `${protocol}://${host || 'localhost:3000'}`;
    const shortUrl = `${baseUrl}/${shortCode}`;

    // Generate QR Code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
      color: {
        dark: '#171717', // Match neutral-900 somewhat
        light: '#ffffff'
      },
      scale: 8,
      margin: 2
    });

    const newDoc = {
      originalUrl,
      shortCode,
      shortUrl,
      qrCode: qrCodeDataUrl,
      createdAt: new Date(),
      clicks: 0
    };

    await collection.insertOne(newDoc);

    return NextResponse.json(newDoc);
  } catch (error) {
    console.error('Error generating short URL:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
