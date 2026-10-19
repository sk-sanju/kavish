import { NextResponse } from 'next/server';
import { getLiveOffers, saveLiveOffers } from '@/lib/serverStore';
import type { PromoOffer } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const offers = getLiveOffers();
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as PromoOffer;
    if (!body || !body.id || !body.code) {
      return NextResponse.json({ error: 'Invalid offer data' }, { status: 400 });
    }

    const currentOffers = getLiveOffers();
    const existingIndex = currentOffers.findIndex(o => o.id === body.id || o.code.toUpperCase() === body.code.toUpperCase());
    let updatedOffers: PromoOffer[];

    if (existingIndex >= 0) {
      updatedOffers = currentOffers.map(o => (o.id === body.id || o.code.toUpperCase() === body.code.toUpperCase()) ? { ...o, ...body } : o);
    } else {
      updatedOffers = [body, ...currentOffers];
    }

    saveLiveOffers(updatedOffers);
    return NextResponse.json({ success: true, offer: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save offer' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing offer ID' }, { status: 400 });
    }

    const currentOffers = getLiveOffers();
    const filtered = currentOffers.filter(o => o.id !== id);
    saveLiveOffers(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
