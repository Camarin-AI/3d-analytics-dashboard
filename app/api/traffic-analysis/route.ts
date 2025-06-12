import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { httpRequestDurationMicroseconds } from '@/lib/metrics';
import logger from '@/lib/logger'; 

export async function GET(request: NextRequest) {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = '/api/traffic-analysis';
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      end({ route, status_code: 400, method: request.method });
      logger.error('Traffic Analysis API error: Date range parameters (from, to) are required', {
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

    const data = await DataService.getTrafficAnalysisData(dateRange);
    end({ route, status_code: 200, method: request.method });
    logger.info('Successfully processed /api/traffic-analysis');
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Traffic Analysis API error:', error);
    end({ route, status_code: 500, method: request.method });
    return NextResponse.json(
      { error: 'Failed to fetch traffic analysis data' },
      { status: 500 }
    );
  }
}