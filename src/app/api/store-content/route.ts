import { NextResponse } from 'next/server';
import { getLiveStoreContent, saveLiveStoreContent } from '../../../lib/serverStore';

export async function GET() {
  try {
    const content = getLiveStoreContent();
    return NextResponse.json({ success: true, content });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = getLiveStoreContent();
    const updated = { ...current, ...body };
    saveLiveStoreContent(updated);
    return NextResponse.json({ success: true, content: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
