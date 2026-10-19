import { NextResponse } from 'next/server';
import { getLiveOrders, saveLiveOrders, getOrderById } from '@/lib/serverStore';
import type { Order } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const tracking = searchParams.get('tracking');

    if (id || tracking) {
      const order = getOrderById((id || tracking)!);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    const orders = getLiveOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Order;
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const currentOrders = getLiveOrders();
    const existingIndex = currentOrders.findIndex(o => o.id === body.id);
    let updatedOrders: Order[];

    if (existingIndex >= 0) {
      updatedOrders = currentOrders.map(o => o.id === body.id ? { ...o, ...body } : o);
    } else {
      updatedOrders = [body, ...currentOrders];
    }

    saveLiveOrders(updatedOrders);
    return NextResponse.json({ success: true, order: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}
