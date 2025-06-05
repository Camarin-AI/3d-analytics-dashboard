import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Date range parameters (from, to) are required' },
        { status: 400 }
      );
    }

    const dateRange = {
      from: new Date(from),
      to: new Date(to)
    };

    const data = await DataService.getSalesFunnelData(dateRange);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Sales Funnel API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales funnel data' },
      { status: 500 }
    );
  }
}