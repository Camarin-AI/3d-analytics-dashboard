// app/api/debug/db/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { httpRequestDurationMicroseconds } from '@/lib/metrics';
import logger from '@/lib/logger'; 

export async function GET(request: NextRequest) {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = '/api/debug/db';
  try {
    logger.info('=== Database Debug Route ===');
    
    // Test basic connection
    const connectionTest = await DataService.testDatabaseConnection();
    logger.info(`Connection test result: ${connectionTest}`);
    
    if (!connectionTest) {
      end({ route, status_code: 500, method: request.method });
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          hasHost: !!process.env.TIMESCALEDB_HOST,
          hasPort: !!process.env.TIMESCALEDB_PORT,
          hasDatabase: !!process.env.TIMESCALEDB_NAME,
          hasUser: !!process.env.TIMESCALEDB_USER,
          hasPassword: !!process.env.TIMESCALEDB_PASSWORD,
          host: process.env.TIMESCALEDB_HOST?.substring(0, 20) + '...',
          port: process.env.TIMESCALEDB_PORT,
          database: process.env.TIMESCALEDB_NAME,
          user: process.env.TIMESCALEDB_USER,
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasHost: !!process.env.TIMESCALEDB_HOST,
        hasPort: !!process.env.TIMESCALEDB_PORT,
        hasDatabase: !!process.env.TIMESCALEDB_NAME,
        hasUser: !!process.env.TIMESCALEDB_USER,
        hasPassword: !!process.env.TIMESCALEDB_PASSWORD,
      }
    });

  } catch (error) {
    logger.error('Debug API error:', error);
    end({ route, status_code: 500, method: request.method });
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}