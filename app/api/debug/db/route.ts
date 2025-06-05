// app/api/debug/db/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Database Debug Route ===');
    
    // Test basic connection
    const connectionTest = await DataService.testDatabaseConnection();
    console.log('Connection test result:', connectionTest);
    
    if (!connectionTest) {
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
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}