import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET(req, { params }) {
  const { code } = await params;

  if (!process.env.MONGODB_URI) {
    return new NextResponse('Database configuration missing', { status: 500 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('shortlify');
    const collection = db.collection('urls');

    const result = await collection.findOneAndUpdate(
      { shortCode: code },
      { $inc: { clicks: 1 } },
      { returnDocument: 'after' }
    );

    if (result) {
      return NextResponse.redirect(result.originalUrl);
    }

    return new NextResponse('URL not found', { status: 404 });
  } catch (err) {
    console.error('Redirect Error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
