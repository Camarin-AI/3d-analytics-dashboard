import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skuId = searchParams.get('skuId') || 'ID140001';

    const data = await DataService.getSKUData(skuId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('SKU Data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SKU data' },
      { status: 500 }
    );
  }
}