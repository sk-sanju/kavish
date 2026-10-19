import { NextResponse } from 'next/server';
import { getLiveReviews, saveLiveReviews } from '@/lib/serverStore';
import type { Review } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const reviews = getLiveReviews();
    if (productId) {
      const filtered = reviews.filter(r => r.productId === productId);
      return NextResponse.json(filtered);
    }
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Review;
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Invalid review data' }, { status: 400 });
    }

    const currentReviews = getLiveReviews();
    const existingIndex = currentReviews.findIndex(r => r.id === body.id);
    let updatedReviews: Review[];

    if (existingIndex >= 0) {
      updatedReviews = currentReviews.map(r => r.id === body.id ? { ...r, ...body } : r);
    } else {
      updatedReviews = [body, ...currentReviews];
    }

    saveLiveReviews(updatedReviews);
    return NextResponse.json({ success: true, review: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing review ID' }, { status: 400 });
    }

    const currentReviews = getLiveReviews();
    const filtered = currentReviews.filter(r => r.id !== id);
    saveLiveReviews(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
