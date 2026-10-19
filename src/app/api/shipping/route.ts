import { NextResponse } from 'next/server';
import { getLiveShippingConfig, saveLiveShippingConfig } from '@/lib/serverStore';
import type { ShippingConfig } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getLiveShippingConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shipping configuration' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<ShippingConfig>;
    const cleanConfig: ShippingConfig = {
      freeShippingThreshold: Number(body.freeShippingThreshold) || 0,
      standardFlatRate: Number(body.standardFlatRate) || 0
    };
    saveLiveShippingConfig(cleanConfig);
    return NextResponse.json({ success: true, config: cleanConfig });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save shipping configuration' }, { status: 500 });
  }
}
