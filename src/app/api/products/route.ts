import { NextResponse } from 'next/server';
import { getLiveProducts, saveLiveProducts } from '../../../lib/serverStore';
import type { Product } from '../../../types';

export async function GET() {
  try {
    const products = getLiveProducts();
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentProducts = getLiveProducts();
    
    // Case 1: Bulk update of all products
    if (Array.isArray(body)) {
      saveLiveProducts(body);
      return NextResponse.json({ success: true, count: body.length });
    }

    // Case 2: Single product upsert
    const product: Product = body;
    if (!product || !product.name) {
      return NextResponse.json({ success: false, error: 'Product name is required.' }, { status: 400 });
    }

    const existingIdx = currentProducts.findIndex(p => p.id === product.id);
    let updatedProducts: Product[];
    if (existingIdx >= 0) {
      updatedProducts = currentProducts.map(p => p.id === product.id ? product : p);
    } else {
      updatedProducts = [product, ...currentProducts];
    }

    saveLiveProducts(updatedProducts);
    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const currentProducts = getLiveProducts();
    const updated = currentProducts.filter(p => p.id !== id);
    saveLiveProducts(updated);
    return NextResponse.json({ success: true, removedId: id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
