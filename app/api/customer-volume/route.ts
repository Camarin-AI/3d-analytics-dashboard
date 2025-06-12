import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { httpRequestDurationMicroseconds } from '@/lib/metrics';
import logger from '@/lib/logger'; 

export async function GET(request: NextRequest) {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = '/api/customer-volume';
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      end({ route, status_code: 400, method: request.method });
      logger.error('Customer Volume API error: Date range parameters (from, to) are required', {
        from,
        to
      });
      return NextResponse.json(
        { error: 'Date range parameters (from, to) are required' },
        { status: 400 }
      );
    }

    const dateRange = {
      from: new Date(from),
      to: new Date(to)
    };

    const data = await DataService.getCustomerVolumeData(dateRange);
    end({ route, status_code: 200, method: request.method });
    logger.info('Successfully processed /api/customer-volume');
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Customer Volume API error:', error);
    end({ route, status_code: 500, method: request.method });
    return NextResponse.json(
      { error: 'Failed to fetch customer volume data' },
      { status: 500 }
    );
  }
}