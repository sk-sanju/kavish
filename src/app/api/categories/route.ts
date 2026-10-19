import { NextResponse } from 'next/server';
import { getLiveCategories, saveLiveCategories } from '../../../lib/serverStore';
import type { CategoryItem } from '../../../types';

export async function GET() {
  try {
    const categories = getLiveCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentCategories = getLiveCategories();

    // Case 1: Bulk update of all categories
    if (Array.isArray(body)) {
      saveLiveCategories(body);
      return NextResponse.json({ success: true, categories: body });
    }

    // Case 2: Single category upsert
    const category: CategoryItem = body;
    if (!category || !category.name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }

    const existingIdx = currentCategories.findIndex(c => c.id === category.id);
    let updatedCategories: CategoryItem[];
    if (existingIdx >= 0) {
      updatedCategories = currentCategories.map(c => c.id === category.id ? category : c);
    } else {
      updatedCategories = [category, ...currentCategories];
    }

    saveLiveCategories(updatedCategories);
    return NextResponse.json({ success: true, category });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    const currentCategories = getLiveCategories();
    const updated = currentCategories.filter(c => c.id !== id);
    saveLiveCategories(updated);
    return NextResponse.json({ success: true, removedId: id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
