import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { httpRequestDurationMicroseconds } from '@/lib/metrics';
import logger from '@/lib/logger'; 

export async function GET(request: NextRequest) {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = '/api/sku-data';
  try {
    const { searchParams } = new URL(request.url);
    const skuId = searchParams.get('skuId') || 'ID140001';

    const data = await DataService.getSKUData(skuId);
    end({ route, status_code: 200, method: request.method });
    logger.info('Successfully processed /api/sku-data', { skuId });
    return NextResponse.json(data);
  } catch (error) {
    logger.error('SKU Data API error:', error);
    end({ route, status_code: 500, method: request.method });
    return NextResponse.json(
      { error: 'Failed to fetch SKU data' },
      { status: 500 }
    );
  }
}