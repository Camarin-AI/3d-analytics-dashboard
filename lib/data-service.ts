import { query, testConnection } from './db';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface KPIData {
  totalVisits: number;
  totalVisitsChange: number;
  conversions: number;
  conversionsChange: number;
  bounceRate: number;
  bounceRateChange: number;
  avgDuration: number;
  avgDurationChange: number;
}

export interface SalesOverviewData {
  chartData: Array<{
    name: string;
    social: number;
    redirect: number;
    direct: number;
  }>;
  loadToOpportunity: number;
  opportunityToWin: number;
}

export interface TrafficAnalysisData {
  deviceData: Array<{ name: string; value: number; color: string }>;
  browserData: Array<{ name: string; value: number; color: string }>;
}

export interface WeeklyVisitorsData {
  data: Array<{ day: number; unique: number; total: number }>;
}

export interface RegionData {
  totalSales: number;
  salesChange: number;
  totalUnits: number;
  unitsChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
  avgReturnRate: number;
  avgReturnRateChange: number;
  avgConversionRate: number;
  avgConversionRateChange: number;
  regions: Array<{ name: string; value: number; color: string }>;
  customerCounts: { newCustomers: number; returningCustomers: number };
  genderDistribution: { male: number; female: number };
}

export interface CustomerVolumeData {
  chartData: Array<{
    age: string;
    men: number;
    women: number;
  }>;
}

export interface SKUData {
  name: string;
  id: string;
  stock: string;
  listed: string;
  digitised: string;
  price: number;
  categories: string[];
  thisWeekSales: number;
  dailyAverage: number;
  conversionRate: number;
  averageCTR: number;
  imageSrc: string;
}

export interface VisitorAnalysisData {
  heatmapData: Record<string, number[]>;
  platforms: string[];
  days: string[];
}

export interface SalesFunnelData {
  weeklyRevenue: number;
  stages: Array<{
    value: string;
    percent: number;
    change: number | null;
    color: string;
  }>;
  unitsSold: number;
}

export interface InteractionDurationData {
  data: Array<{
    day: string;
    unique: number;
    total: number;
    prevUnique: number;
    prevTotal: number;
  }>;
}

export interface TotalSalesData {
  totalSales: number;
  previousWeekSales: number;
  progressPercent: number;
  salesData: Array<{
    day: string;
    socialMedia: number;
    redirectLinks: number;
    directLogin: number;
  }>;
}

export interface ConversionRatesData {
  chartData: Array<{
    withEmbeds: number;
    withoutEmbeds: number;
  }>;
}

export interface ReturnRatesData {
  without: { rate: number; trend: string };
  with: { rate: number; trend: string };
}

export interface EmbedAssistedRevenueData {
  data: Array<{ day: number; unique: number; total: number }>;
}

export class DataService {

  static async testDatabaseConnection(): Promise<boolean> {
    try {
      return await testConnection();
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Enhanced error handling wrapper
  private static async executeQuery<T>(
    queryFn: () => Promise<T>,
    fallbackData: T,
    queryName: string
  ): Promise<T> {
    try {
      return await queryFn();
    } catch (error) {
      console.error(`${queryName} query failed:`, error);
      console.warn(`Falling back to default data for ${queryName}`);
      return fallbackData;
    }
  }

  static async getKPIData(dateRange: DateRange): Promise<KPIData> {
    return this.executeQuery(
      async () => {
        // Validate date range
        if (!dateRange.from || !dateRange.to) {
          throw new Error('Invalid date range provided');
        }

        const currentWeekQuery = `
          SELECT 
            COALESCE(SUM(total_visits), 0) as total_visits,
            COALESCE(AVG(avg_duration), 0) as avg_duration,
            COALESCE(SUM(total_bounces)::float / NULLIF(SUM(total_visits), 0) * 100, 0) as bounce_rate
          FROM daily_visits_summary 
          WHERE bucket >= $1 AND bucket <= $2
        `;

        const previousWeekQuery = `
          SELECT 
            COALESCE(SUM(total_visits), 0) as total_visits,
            COALESCE(AVG(avg_duration), 0) as avg_duration,
            COALESCE(SUM(total_bounces)::float / NULLIF(SUM(total_visits), 0) * 100, 0) as bounce_rate
          FROM daily_visits_summary 
          WHERE bucket >= $1 AND bucket <= $2
        `;

        const currentWeekStart = dateRange.from;
        const currentWeekEnd = dateRange.to;
        const previousWeekStart = new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        const previousWeekEnd = new Date(currentWeekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [currentResult, previousResult] = await Promise.all([
          query(currentWeekQuery, [currentWeekStart, currentWeekEnd]),
          query(previousWeekQuery, [previousWeekStart, previousWeekEnd])
        ]);

        const current = currentResult.rows[0] || {};
        const previous = previousResult.rows[0] || {};

        const conversionsQuery = `
          SELECT COALESCE(COUNT(*), 0)::int as conversions
          FROM sales_funnel_events 
          WHERE funnel_stage = 'conversion' 
          AND event_timestamp >= $1 AND event_timestamp <= $2
        `;

        const previousConversionsQuery = `
          SELECT COALESCE(COUNT(*), 0)::int as conversions
          FROM sales_funnel_events 
          WHERE funnel_stage = 'conversion' 
          AND event_timestamp >= $1 AND event_timestamp <= $2
        `;

        const [currentConversionsResult, previousConversionsResult] = await Promise.all([
          query(conversionsQuery, [currentWeekStart, currentWeekEnd]),
          query(previousConversionsQuery, [previousWeekStart, previousWeekEnd])
        ]);

        const currentConv = currentConversionsResult.rows[0]?.conversions || 0;
        const previousConv = previousConversionsResult.rows[0]?.conversions || 0;

        const currentTotalVisits = parseInt(current.total_visits) || 0;
        const previousTotalVisits = parseInt(previous.total_visits) || 0;
        const currentBounceRate = parseFloat(current.bounce_rate) || 0;
        const previousBounceRate = parseFloat(previous.bounce_rate) || 0;
        const currentAvgDuration = parseFloat(current.avg_duration) || 0;
        const previousAvgDuration = parseFloat(previous.avg_duration) || 0;

        return {
          totalVisits: currentTotalVisits,
          totalVisitsChange: previousTotalVisits ? 
            Math.round(((currentTotalVisits - previousTotalVisits) / previousTotalVisits) * 100) : 0,
          conversions: currentConv,
          conversionsChange: previousConv ? 
            Math.round(((currentConv - previousConv) / previousConv) * 100) : 0,
          bounceRate: Math.round(currentBounceRate),
          bounceRateChange: previousBounceRate ? 
            Math.round(((currentBounceRate - previousBounceRate) / previousBounceRate) * 100) : 0,
          avgDuration: Math.round(currentAvgDuration),
          avgDurationChange: previousAvgDuration ? 
            Math.round(((currentAvgDuration - previousAvgDuration) / previousAvgDuration) * 100) : 0,
        };
      },
      // Fallback data
      {
        totalVisits: 45231,
        totalVisitsChange: 12,
        conversions: 1205,
        conversionsChange: 8,
        bounceRate: 34,
        bounceRateChange: -5,
        avgDuration: 245,
        avgDurationChange: 15,
      },
      'KPI Data'
    );
  }

  static async getSalesOverviewData(dateRange: DateRange): Promise<SalesOverviewData> {
    const dailyTrafficQuery = `
      SELECT 
        EXTRACT(DOW FROM bucket) as day_of_week,
        traffic_source,
        SUM(total_visits) as visits
      FROM daily_visits_summary 
      WHERE bucket >= $1 AND bucket <= $2
      GROUP BY EXTRACT(DOW FROM bucket), traffic_source
      ORDER BY day_of_week
    `;

    const result = await query(dailyTrafficQuery, [dateRange.from, dateRange.to]);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = [];

    for (let i = 0; i < 7; i++) { // DOW: 0 (Sun) to 6 (Sat)
      const dayDataForDay = result.rows.filter(row => Number(row.day_of_week) === i);
      chartData.push({
        name: dayNames[i],
        social: Number(dayDataForDay.find(d => d.traffic_source === 'social')?.visits) || 0,
        redirect: Number(dayDataForDay.find(d => d.traffic_source === 'redirect')?.visits) || 0,
        direct: Number(dayDataForDay.find(d => d.traffic_source === 'direct')?.visits) || 0,
      });
    }

    const conversionMetricsQuery = `
      WITH funnel_stats AS (
        SELECT 
          funnel_stage,
          COUNT(*) as stage_count
        FROM sales_funnel_events 
        WHERE event_timestamp >= $1 AND event_timestamp <= $2
        GROUP BY funnel_stage
      )
      SELECT 
        (SELECT stage_count FROM funnel_stats WHERE funnel_stage = 'opportunity')::float / 
        NULLIF((SELECT stage_count FROM funnel_stats WHERE funnel_stage = 'impression'), 0) * 100 as load_to_opportunity,
        (SELECT stage_count FROM funnel_stats WHERE funnel_stage = 'conversion')::float / 
        NULLIF((SELECT stage_count FROM funnel_stats WHERE funnel_stage = 'opportunity'), 0) * 100 as opportunity_to_win
    `;

    const conversionResult = await query(conversionMetricsQuery, [dateRange.from, dateRange.to]);
    const conversionData = conversionResult.rows[0];

    return {
      chartData,
      loadToOpportunity: Math.round(Number(conversionData?.load_to_opportunity) || 64),
      opportunityToWin: Math.round(Number(conversionData?.opportunity_to_win) || 18),
    };
  }

  static async getTrafficAnalysisData(dateRange: DateRange): Promise<TrafficAnalysisData> {
    return this.executeQuery(
      async () => {
        const deviceQuery = `
          SELECT 
            COALESCE(device_type, 'Unknown') as device_type,
            COALESCE(SUM(total_visits), 0) as visits
          FROM daily_visits_summary 
          WHERE bucket >= $1 AND bucket <= $2
          GROUP BY device_type
          ORDER BY visits DESC
        `;

        const browserQuery = `
          SELECT 
            COALESCE(wv.browser_type, 'Unknown') as browser_type,
            COUNT(*) as visits
          FROM website_visits wv
          WHERE wv.visit_timestamp >= $1 AND wv.visit_timestamp <= $2
          GROUP BY wv.browser_type
          ORDER BY visits DESC
        `;

        const [deviceResult, browserResult] = await Promise.all([
          query(deviceQuery, [dateRange.from, dateRange.to]),
          query(browserQuery, [dateRange.from, dateRange.to])
        ]);

        const totalDeviceVisits = deviceResult.rows.reduce((sum, row) => sum + (Number(row.visits) || 0), 0);
        const totalBrowserVisits = browserResult.rows.reduce((sum, row) => sum + (Number(row.visits) || 0), 0);

        const deviceColors = ["#1E3A8A", "#F59E0B", "#10B981"];
        const browserColors = ["#1E3A8A", "#F59E0B", "#10B981"];

        const deviceData = deviceResult.rows.slice(0, 3).map((row, index) => ({
          name: row.device_type || 'Unknown',
          value: totalDeviceVisits ? Math.round(((Number(row.visits) || 0) / totalDeviceVisits) * 100) : 0,
          color: deviceColors[index % deviceColors.length]
        }));

        const browserData = browserResult.rows.slice(0, 3).map((row, index) => ({
          name: row.browser_type || 'Unknown',
          value: totalBrowserVisits ? Math.round(((Number(row.visits) || 0) / totalBrowserVisits) * 100) : 0,
          color: browserColors[index % browserColors.length]
        }));

        return { deviceData, browserData };
      },
      // Fallback data
      {
        deviceData: [
          { name: "Laptop & PC", value: 70, color: "#1E3A8A" },
          { name: "Mobile Phones", value: 20, color: "#F59E0B" },
          { name: "Tablets & Others", value: 10, color: "#10B981" },
        ],
        browserData: [
          { name: "Chrome", value: 60, color: "#1E3A8A" },
          { name: "Safari", value: 25, color: "#F59E0B" },
          { name: "Firefox", value: 15, color: "#10B981" },
        ]
      },
      'Traffic Analysis Data'
    );
  }

  static async getWeeklyVisitorsData(dateRange: DateRange): Promise<WeeklyVisitorsData> {
    return this.executeQuery(
      async () => {
        const dailyVisitsQuery = `
          SELECT 
            EXTRACT(DOW FROM bucket) as day,
            COALESCE(SUM(unique_sessions), 0) as unique_visitors,
            COALESCE(SUM(total_visits), 0) as total_visitors
          FROM daily_visits_summary 
          WHERE bucket >= $1 AND bucket <= $2
          GROUP BY EXTRACT(DOW FROM bucket)
          ORDER BY day
        `;

        const result = await query(dailyVisitsQuery, [dateRange.from, dateRange.to]);
        
        const data = result.rows.map(row => ({
          day: Number(row.day) + 1, // Assuming day 1-7 is expected, DOW is 0-6
          unique: Number(row.unique_visitors) || 0,
          total: Number(row.total_visitors) || 0,
        }));

        // Fill missing days with zeros
        const completeData = [];
        for (let i = 1; i <= 7; i++) {
          const existingDay = data.find(d => d.day === i);
          completeData.push(existingDay || { day: i, unique: 0, total: 0 });
        }

        return { data: completeData };
      },
      // Fallback data
      {
        data: [
          { day: 1, unique: 40000, total: 60000 },
          { day: 2, unique: 63480, total: 85000 },
          { day: 3, unique: 30000, total: 58000 },
          { day: 4, unique: 72000, total: 90000 },
          { day: 5, unique: 55000, total: 88000 },
          { day: 6, unique: 48000, total: 92000 },
          { day: 7, unique: 35000, total: 65000 },
        ]
      },
      'Weekly Visitors Data'
    );
  }

  static async getWeeklyVisitsData(dateRange: DateRange): Promise<{ data: { day: number; unique: number; total: number }[] }> {
    const dailyVisitsQuery = `
      SELECT 
        EXTRACT(DOW FROM bucket) as day,
        0 as unique_visitors,
        SUM(total_visits) as total_visitors
      FROM daily_visits_summary 
      WHERE bucket >= $1 AND bucket <= $2
      GROUP BY EXTRACT(DOW FROM bucket)
      ORDER BY day
    `;
    const result = await query(dailyVisitsQuery, [dateRange.from, dateRange.to]);
    const data = result.rows.map(row => ({
      day: Number(row.day) + 1,
      unique: 0,
      total: Number(row.total_visitors) || 0,
    }));
    // Fill missing days with zeros
    const completeData = [];
    for (let i = 1; i <= 7; i++) {
      const existingDay = data.find(d => d.day === i);
      completeData.push(existingDay || { day: i, unique: 0, total: 0 });
    }
    return { data: completeData };
  }

  static async getRegionData(dateRange: DateRange): Promise<RegionData> {
    const regionSalesQuery = `
      SELECT 
        r.name as region_name,
        SUM(dss.total_revenue) as revenue,
        SUM(dss.total_units_sold) as units
      FROM daily_sales_summary dss
      JOIN regions r ON dss.region_id = r.region_id
      WHERE dss.bucket >= $1 AND dss.bucket <= $2
      GROUP BY r.region_id, r.name
    `;

    const totalSalesQuery = `
      SELECT 
        SUM(total_revenue) as total_revenue,
        SUM(total_units_sold) as total_units,
        AVG(total_revenue / NULLIF(total_orders, 0)) as avg_order_value
      FROM daily_sales_summary 
      WHERE bucket >= $1 AND bucket <= $2
    `;

    const customerCountsQuery = `
      SELECT 
        COUNT(CASE WHEN DATE_PART('day', NOW() - created_at) <= 30 THEN 1 END) as new_customers,
        COUNT(CASE WHEN DATE_PART('day', NOW() - created_at) > 30 THEN 1 END) as returning_customers
      FROM users
    `;

    const genderQuery = `
      SELECT 
        gender,
        COUNT(*) as count
      FROM users
      GROUP BY gender
    `;

    const [regionResult, totalResult, customerResult, genderResult] = await Promise.all([
      query(regionSalesQuery, [dateRange.from, dateRange.to]),
      query(totalSalesQuery, [dateRange.from, dateRange.to]),
      query(customerCountsQuery),
      query(genderQuery)
    ]);

    const totalData = totalResult.rows[0] || {};
    const customers = customerResult.rows[0] || {};
    
    const totalRevenue = Number(totalData.total_revenue) || 0;
    const totalUnits = Number(totalData.total_units) || 0;
    const avgOrderValue = Number(totalData.avg_order_value) || 0;

    const totalGenderCount = genderResult.rows.reduce((sum, row) => sum + (Number(row.count) || 0), 0);
    const maleCount = Number(genderResult.rows.find(row => row.gender === 'Male')?.count) || 0;
    const femaleCount = Number(genderResult.rows.find(row => row.gender === 'Female')?.count) || 0;

    const colors = ["#4CD8E5", "#8A70D6"];
    const regions = regionResult.rows.map((row, index) => ({
      name: row.region_name,
      value: totalRevenue ? Math.round(((Number(row.revenue) || 0) / totalRevenue) * 100) : 0,
      color: colors[index % colors.length]
    }));

    return {
      totalSales: Math.round(totalRevenue) || 40000, // Fallback to original default if totalRevenue is 0
      salesChange: 2, // Hardcoded, as per original
      totalUnits: totalUnits || 2000, // Fallback
      unitsChange: 2, // Hardcoded
      avgOrderValue: Math.round(avgOrderValue) || 1000, // Fallback
      avgOrderValueChange: 6, // Hardcoded
      avgReturnRate: 6.5, // Hardcoded
      avgReturnRateChange: 6, // Hardcoded
      avgConversionRate: 5.5, // Hardcoded
      avgConversionRateChange: -6, // Hardcoded
      regions,
      customerCounts: {
        newCustomers: Number(customers.new_customers) || 54081, // Fallback
        returningCustomers: Number(customers.returning_customers) || 8120 // Fallback
      },
      genderDistribution: {
        male: totalGenderCount > 0 ? Math.round((maleCount / totalGenderCount) * 100) : 70, // Fallback
        female: totalGenderCount > 0 ? Math.round((femaleCount / totalGenderCount) * 100) : 30 // Fallback
      }
    };
  }

  static async getCustomerVolumeData(dateRange: DateRange): Promise<CustomerVolumeData> {
    const ageGenderQuery = `
      SELECT 
        age_group,
        gender,
        COUNT(*) as count
      FROM users
      GROUP BY age_group, gender
      ORDER BY 
        CASE age_group 
          WHEN '<18' THEN 1
          WHEN '19-24' THEN 2
          WHEN '25-30' THEN 3
          WHEN '31-35' THEN 4
          WHEN '36-40' THEN 5
          WHEN '41-45' THEN 6
          WHEN '45-50' THEN 7
          WHEN '51-55' THEN 8
          WHEN '>55' THEN 9
          ELSE 10
        END
    `;

    const result = await query(ageGenderQuery);
    
    const ageGroups = ['<18', '19-24', '25-30', '31-35', '36-40', '41-45', '45-50', '51-55', '>55'];
    
    const chartData = ageGroups.map(age => {
      const menCount = Number(result.rows.find(row => row.age_group === age && row.gender === 'Male')?.count) || 0;
      const womenCount = Number(result.rows.find(row => row.age_group === age && row.gender === 'Female')?.count) || 0;
      
      return {
        age,
        men: menCount,
        women: womenCount
      };
    });

    return { chartData };
  }

  static async getSKUData(skuId: string = 'ID140001'): Promise<SKUData> {
    const skuQuery = `
      SELECT 
        s.*,
        ARRAY_AGG(c.name) as category_names,
        COALESCE(SUM(dss.total_revenue), 0) as week_sales,
        COALESCE(AVG(dss.total_revenue), 0) as daily_avg
      FROM skus s
      LEFT JOIN categories c ON s.category_id = c.category_id
      LEFT JOIN daily_sales_summary dss ON s.sku_id = dss.sku_id 
        AND dss.bucket >= NOW() - INTERVAL '7 days'
      WHERE s.sku_code = $1
      GROUP BY s.sku_id
    `;

    const interactionQuery = `
      SELECT 
        AVG(CASE WHEN interaction_type = 'click' THEN 1.0 ELSE 0.0 END) * 100 as ctr,
        COUNT(CASE WHEN interaction_type = 'conversion' THEN 1 END)::float / 
        NULLIF(COUNT(*), 0) * 100 as conversion_rate
      FROM sku_interactions si
      JOIN skus s ON si.sku_id = s.sku_id
      WHERE s.sku_code = $1
      AND si.interaction_timestamp >= NOW() - INTERVAL '7 days'
    `;

    const [skuResult, interactionResult] = await Promise.all([
      query(skuQuery, [skuId]),
      query(interactionQuery, [skuId])
    ]);

    const sku = skuResult.rows[0];
    const interaction = interactionResult.rows[0];

    if (!sku) {
      return {
        name: "Diamond Cut Earrings",
        id: "ID140001",
        stock: "Available",
        listed: "Yes",
        digitised: "Yes",
        price: 1050,
        categories: ["Earrings", "Diamond"],
        thisWeekSales: 8459,
        dailyAverage: 1650,
        conversionRate: 71,
        averageCTR: 2.3,
        imageSrc: "/diamond-earrings.png"
      };
    }

    return {
      name: sku.name,
      id: sku.sku_code,
      stock: sku.stock_status,
      listed: sku.is_listed ? "Yes" : "No",
      digitised: sku.is_digitized ? "Yes" : "No",
      price: parseFloat(sku.price),
      categories: sku.category_names?.filter(Boolean) || [],
      thisWeekSales: Math.round(Number(sku.week_sales) || 0),
      dailyAverage: Math.round(Number(sku.daily_avg) || 0),
      conversionRate: Math.round(Number(interaction?.conversion_rate) || 71), // Fallback to original
      averageCTR: parseFloat(Number(interaction?.ctr || 2.3).toFixed(1)), // Fallback and format
      imageSrc: sku.image_url || "/diamond-earrings.png"
    };
  }

  static async getVisitorAnalysisData(dateRange: DateRange): Promise<VisitorAnalysisData> {
    const heatmapQuery = `
      SELECT 
        wv.traffic_source,
        EXTRACT(DOW FROM wv.visit_timestamp) as day_of_week,
        COUNT(*) as visits
      FROM website_visits wv
      WHERE wv.visit_timestamp >= $1 AND wv.visit_timestamp <= $2
      GROUP BY wv.traffic_source, EXTRACT(DOW FROM wv.visit_timestamp)
    `;

    const result = await query(heatmapQuery, [dateRange.from, dateRange.to]);
    
    const platforms = ["Instagram", "Google", "WhatsApp", "Facebook", "TikTok"];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Mon=0 to Sun=6
    
    const heatmapData: Record<string, number[]> = {};
    
    platforms.forEach(platform => {
      heatmapData[platform] = new Array(7).fill(0);
    });

    result.rows.forEach(row => {
      const platformName = platforms.find(p => row.traffic_source?.toLowerCase().includes(p.toLowerCase()));
      if (platformName) {
        const dow = Number(row.day_of_week); // 0=Sun, 1=Mon, ..., 6=Sat
        const dayIndex = (dow === 0) ? 6 : dow - 1; // Convert DOW to Mon=0..Sun=6 index
        if (dayIndex >= 0 && dayIndex < 7) { // Ensure dayIndex is valid
           heatmapData[platformName][dayIndex] = (heatmapData[platformName][dayIndex] || 0) + (Number(row.visits) || 0);
        }
      }
    });

    return { heatmapData, platforms, days };
  }

  static async getSalesFunnelData(dateRange: DateRange): Promise<SalesFunnelData> {
    const funnelQuery = `
      WITH funnel_counts AS (
        SELECT 
          funnel_stage,
          COUNT(*) as count
        FROM sales_funnel_events 
        WHERE event_timestamp >= $1 AND event_timestamp <= $2
        GROUP BY funnel_stage
      ),
      total_impressions AS (
        SELECT count FROM funnel_counts WHERE funnel_stage = 'impression'
      )
      SELECT 
        fc.funnel_stage,
        fc.count,
        ROUND((fc.count::float / NULLIF(ti.count,0)) * 100) as percentage
      FROM funnel_counts fc
      CROSS JOIN total_impressions ti
      ORDER BY 
        CASE fc.funnel_stage
          WHEN 'impression' THEN 1
          WHEN 'interaction' THEN 2
          WHEN 'add_to_cart' THEN 3
          WHEN 'opportunity' THEN 4
          WHEN 'conversion' THEN 5
          ELSE 6
        END
    `;

    const revenueQuery = `
      SELECT SUM(total_revenue) as weekly_revenue
      FROM daily_sales_summary 
      WHERE bucket >= $1 AND bucket <= $2
    `;

    const unitsQuery = `
      SELECT SUM(total_units_sold) as units_sold
      FROM daily_sales_summary 
      WHERE bucket >= $1 AND bucket <= $2
    `;

    const [funnelResult, revenueResult, unitsResult] = await Promise.all([
      query(funnelQuery, [dateRange.from, dateRange.to]),
      query(revenueQuery, [dateRange.from, dateRange.to]),
      query(unitsQuery, [dateRange.from, dateRange.to])
    ]);

    const colors = ["#0090FF", "#4DD7FE", "#16A085", "#0D8072", "#065F46"];
    const stages = funnelResult.rows.map((row, index) => ({
      value: `${(Number(row.count) / 1000).toFixed(1)}k`,
      percent: Number(row.percentage) || 0,
      change: index === 0 ? null : Math.floor(Math.random() * 10) - 3, // Original random change
      color: colors[index % colors.length]
    }));

    return {
      weeklyRevenue: Math.round(Number(revenueResult.rows[0]?.weekly_revenue) || 8459), // Fallback
      stages,
      unitsSold: Number(unitsResult.rows[0]?.units_sold) || 500 // Fallback
    };
  }

  static async getInteractionDurationData(dateRange: DateRange): Promise<InteractionDurationData> {
    const durationQuery = `
      SELECT 
        EXTRACT(DOW FROM interaction_timestamp) as day,
        AVG(CASE WHEN interaction_type = '3DView' THEN duration_seconds END) as sku_duration,
        AVG(duration_seconds) as site_avg_duration
      FROM sku_interactions
      WHERE interaction_timestamp >= $1 AND interaction_timestamp <= $2
      GROUP BY EXTRACT(DOW FROM interaction_timestamp)
      ORDER BY day
    `;

    const result = await query(durationQuery, [dateRange.from, dateRange.to]);
    
    const data = result.rows.map(row => {
      const skuDuration = Number(row.sku_duration) || 50; // Fallback
      const siteAvgDuration = Number(row.site_avg_duration) || 45; // Fallback
      return {
        day: (Number(row.day) + 1).toString(), // DOW (0-6) to day number string "1"-"7"
        unique: Math.round(skuDuration),
        total: Math.round(siteAvgDuration),
        prevUnique: Math.round(skuDuration * 0.9), // Original derived placeholder
        prevTotal: Math.round(siteAvgDuration * 0.9) // Original derived placeholder
      };
    });
    return { data };
  }

  static async getTotalSalesData(dateRange: DateRange): Promise<TotalSalesData> {
    const salesQuery = `
      SELECT SUM(total_revenue) as total_sales
      FROM daily_sales_summary 
      WHERE bucket >= $1 AND bucket <= $2
    `;

    const previousWeekSalesQuery = `
      SELECT SUM(total_revenue) as previous_sales
      FROM daily_sales_summary 
      WHERE bucket >= $1 AND bucket <= $2
    `;

    const dailyBreakdownQuery = `
      SELECT 
        EXTRACT(DOW FROM dvs.bucket) as day_of_week,
        dvs.traffic_source,
        SUM(dvs.total_visits) as visits -- Changed from total_revenue for visit breakdown
      FROM daily_visits_summary dvs
      WHERE dvs.bucket >= $1 AND dvs.bucket <= $2
      GROUP BY EXTRACT(DOW FROM dvs.bucket), dvs.traffic_source
    `;

    const previousWeekStart = new Date(dateRange.from.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekEnd = new Date(dateRange.to.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [salesResult, previousWeekSalesResult, breakdownResult] = await Promise.all([
      query(salesQuery, [dateRange.from, dateRange.to]),
      query(previousWeekSalesQuery, [previousWeekStart, previousWeekEnd]), // Corrected params
      query(dailyBreakdownQuery, [dateRange.from, dateRange.to])
    ]);

    const totalSales = Math.round(Number(salesResult.rows[0]?.total_sales) || 35248); // Fallback
    const previousWeekSales = Math.round(Number(previousWeekSalesResult.rows[0]?.previous_sales) || 15230); // Fallback
    
    const totalForProgress = totalSales + previousWeekSales;
    const progressPercent = totalForProgress > 0 ? Math.round((totalSales / totalForProgress) * 100) : 0;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const salesDataMap: { [key: number]: { socialMedia: number; redirectLinks: number; directLogin: number } } = {};

    for (const row of breakdownResult.rows) {
        const dow = Number(row.day_of_week);
        if (dow < 0 || dow > 6) continue; // Skip invalid DOW
        if (!salesDataMap[dow]) {
            salesDataMap[dow] = { socialMedia: 0, redirectLinks: 0, directLogin: 0 };
        }
        const visits = Number(row.visits) || 0;
        if (row.traffic_source === 'social') salesDataMap[dow].socialMedia += visits;
        else if (row.traffic_source === 'redirect') salesDataMap[dow].redirectLinks += visits;
        else if (row.traffic_source === 'direct') salesDataMap[dow].directLogin += visits;
    }

    const salesData = dayNames.map((dayName, index) => {
        // index is DOW (0 for Sun, 1 for Mon, etc.)
        return {
            day: dayName,
            socialMedia: salesDataMap[index]?.socialMedia || 0,
            redirectLinks: salesDataMap[index]?.redirectLinks || 0,
            directLogin: salesDataMap[index]?.directLogin || 0,
        };
    });

    return {
      totalSales,
      previousWeekSales,
      progressPercent,
      salesData
    };
  }

  static async getConversionRatesData(dateRange: DateRange): Promise<ConversionRatesData> {
    const conversionQuery = `
      SELECT 
        embed_assisted,
        COUNT(CASE WHEN interaction_type = 'conversion' THEN 1 END)::float / 
        NULLIF(COUNT(*), 0) * 100 as conversion_rate
      FROM sku_interactions
      WHERE interaction_timestamp >= $1 AND interaction_timestamp <= $2
      GROUP BY embed_assisted
    `;

    const result = await query(conversionQuery, [dateRange.from, dateRange.to]);
    
    const withEmbedsRate = parseFloat(result.rows.find(row => row.embed_assisted === true)?.conversion_rate) || 45; // Fallback
    const withoutEmbedsRate = parseFloat(result.rows.find(row => row.embed_assisted === false)?.conversion_rate) || 35; // Fallback

    // Original placeholder chart data generation
    const chartData = Array.from({ length: 6 }, (_, i) => ({
      withEmbeds: Math.round(withEmbedsRate + (Math.random() * 10 - 5)),
      withoutEmbeds: Math.round(withoutEmbedsRate + (Math.random() * 10 - 5))
    }));

    return { chartData };
  }

  static async getReturnRatesData(dateRange: DateRange): Promise<ReturnRatesData> {
    const returnQuery = `
      SELECT 
        embed_assisted,
        COUNT(CASE WHEN interaction_type = 'return' THEN 1 END)::float / 
        NULLIF(COUNT(*), 0) * 100 as return_rate
      FROM sku_interactions
      WHERE interaction_timestamp >= $1 AND interaction_timestamp <= $2
      GROUP BY embed_assisted
    `;

    const result = await query(returnQuery, [dateRange.from, dateRange.to]);
    
    const withEmbedsRate = parseFloat(result.rows.find(row => row.embed_assisted === true)?.return_rate) || 45; // Fallback
    const withoutEmbedsRate = parseFloat(result.rows.find(row => row.embed_assisted === false)?.return_rate) || 71; // Fallback

    return {
      without: { 
        rate: Math.round(withoutEmbedsRate), 
        trend: withoutEmbedsRate > 50 ? "down" : "up" // Original arbitrary trend
      },
      with: { 
        rate: Math.round(withEmbedsRate), 
        trend: withEmbedsRate > 50 ? "down" : "up" // Original arbitrary trend
      }
    };
  }

  static async getEmbedAssistedRevenueData(dateRange: DateRange): Promise<EmbedAssistedRevenueData> {
    const revenueQuery = `
      SELECT 
        EXTRACT(DOW FROM si.interaction_timestamp) as day,
        COUNT(CASE WHEN si.embed_assisted = true THEN 1 END) as embed_assisted_interactions,
        COUNT(*) as total_interactions
      FROM sku_interactions si
      WHERE si.interaction_timestamp >= $1 AND si.interaction_timestamp <= $2
      GROUP BY EXTRACT(DOW FROM si.interaction_timestamp)
      ORDER BY day
    `;

    const result = await query(revenueQuery, [dateRange.from, dateRange.to]);
    
    const data = result.rows.map(row => {
      // Removed random data and large multipliers, assuming these represent counts or scaled revenue.
      // If these are meant to be monetary values, the query should sum revenue.
      // For now, treating them as interaction counts.
      const embedAssistedCount = Number(row.embed_assisted_interactions) || 0;
      const totalInteractionsCount = Number(row.total_interactions) || 0;
      
      // Original logic had large random numbers and *1000.
      // Reverting to simpler interpretation based on query, can be adjusted if intent was different.
      return {
        day: Number(row.day) + 1, // DOW (0-6) to 1-7
        unique: embedAssistedCount, // Assuming 'unique' refers to embed-assisted interactions
        total: totalInteractionsCount, // Assuming 'total' refers to all interactions
      };
    });

    return { data };
  }
}