import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Parse date range from query params (optional, fallback to last 7 days)
  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const from = fromParam ? new Date(fromParam) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const to = toParam ? new Date(toParam) : new Date();

  // Fallback data for sales page traffic analysis
  const fallback = {
    deviceData: [
      { name: "New Customers", value: 80, color: "#1E3A8A" },
      { name: "Returning Customers", value: 20, color: "#F59E0B" },
    ]
  };

  try {
    // New customers: users created in range
    const newCustomersResult = await query(
      `SELECT COUNT(*) as count FROM users WHERE created_at >= $1 AND created_at <= $2`,
      [from, to]
    );
    const newCustomers = Number(newCustomersResult.rows[0]?.count) || 0;

    // Returning customers: users who logged in in range but created before
    const returningCustomersResult = await query(
      `SELECT COUNT(*) as count FROM users WHERE last_login_at >= $1 AND last_login_at <= $2 AND created_at < $1`,
      [from, to]
    );
    const returningCustomers = Number(returningCustomersResult.rows[0]?.count) || 0;

    const total = newCustomers + returningCustomers;
    // Avoid division by zero
    const deviceData = total > 0 ? [
      { name: "New Customers", value: Math.round((newCustomers / total) * 100), color: "#1E3A8A" },
      { name: "Returning Customers", value: Math.round((returningCustomers / total) * 100), color: "#F59E0B" },
    ] : fallback.deviceData;

    return NextResponse.json({ deviceData });
  } catch (e) {
    return NextResponse.json(fallback);
  }
} 