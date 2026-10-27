import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicDir = path.join(process.cwd(), 'public');

    // Attempt to write to public/ directory if writable
    try {
      fs.writeFileSync(path.join(publicDir, 'resume.pdf'), buffer);
      fs.writeFileSync(path.join(publicDir, 'Ravi_Mohan_Rohela_Resume.pdf'), buffer);
    } catch (writeErr) {
      console.warn('Filesystem read-only (serverless environment):', writeErr);
    }

    // Convert to base64 Data URI so it can work 100% reliably in any environment including Vercel
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      resumeUrl: dataUrl,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
