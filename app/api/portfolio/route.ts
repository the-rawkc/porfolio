import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { initialPortfolioData } from '@/lib/default-content';
import { PortfolioData } from '@/lib/portfolio-data';

const STORE_PATH = path.join(process.cwd(), 'lib', 'content-store.json');

export async function GET() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const data: PortfolioData = JSON.parse(raw);
      return NextResponse.json({ success: true, data });
    }
  } catch (err) {
    console.error('Failed to read content store:', err);
  }

  return NextResponse.json({ success: true, data: initialPortfolioData });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    // Try to persist to disk (local dev / persistent environment)
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(body, null, 2), 'utf-8');
    } catch (writeErr) {
      // In serverless read-only filesystem (like Vercel production), writing to disk will fail silently
      // The client localStorage maintains immediate persistence for the user
      console.warn('Filesystem is read-only (serverless environment):', writeErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio data updated successfully',
      data: body,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
