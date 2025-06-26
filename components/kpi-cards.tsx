"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useApiData } from "@/hooks/use-api-data";
import { KPIData } from "@/lib/data-service";
import logger from "@/lib/logger";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface KpiCardsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function KpiCards({ dateRange }: KpiCardsProps) {
  const { data: kpiData, loading, error } = useApiData<KPIData>({
    endpoint: 'kpi',
    dateRange
  });

  if (loading) {
    return <KpiCardsSkeleton />;
  }

  if (error) {
    logger.error('KPI Cards error:', error);
    return <div className="text-red-500">Error loading KPI data</div>;
  }

  if (!kpiData) {
    return <div className="text-gray-500">No KPI data available</div>;
  }

  const kpis = [
    {
      title: "Total Visits",
      value: kpiData.totalVisits.toLocaleString(),
      change: Math.abs(kpiData.totalVisitsChange),
      trend: kpiData.totalVisitsChange >= 0 ? "up" as const : "down" as const,
      period: "last week",
      data: generateSparklineData(30, 0.4),
    },
    {
      title: "Conversions",
      value: `${kpiData.conversions}`,
      change: Math.abs(kpiData.conversionsChange),
      trend: kpiData.conversionsChange >= 0 ? "up" as const : "down" as const,
      period: "last week",
      data: generateSparklineData(30, 0.6),
    },
    {
      title: "Bounce Rate",
      value: `${kpiData.bounceRate}%`,
      change: Math.abs(kpiData.bounceRateChange),
      trend: kpiData.bounceRateChange <= 0 ? "up" as const : "down" as const,
      period: "last week",
      data: generateSparklineData(30, 0.6),
    },
    {
      title: "Visit Duration",
      value: `${Math.floor(kpiData.avgDuration / 60)}m ${kpiData.avgDuration % 60}s`,
      change: Math.abs(kpiData.avgDurationChange),
      trend: kpiData.avgDurationChange >= 0 ? "up" as const : "down" as const,
      period: "last week",
      data: generateSparklineData(30, 0.5),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {kpis.map((kpi, idx) => (
        <KpiCard key={idx} {...kpi} />
      ))}
    </div>
  );
}

function KpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-[#121212] rounded p-6 border-black animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-700 rounded w-16 mb-4"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  period: string;
  data: number[];
}

function KpiCard({ title, value, change, trend, period, data }: KpiCardProps) {
  const isUp = trend === "up";

  const lineColor = isUp ? "#C0AFE2" : "#EF4444";
  const fillToColor = isUp ? "#D8B4FE" : "#FECACA";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      animations: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: [lineColor],
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: [fillToColor],
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    tooltip: { enabled: false },
  };

  return (
    <div className="flex items-center justify-between bg-[#121212] rounded p-6 border-black overflow-hidden">
      <div>
        <p className="text-xs font-light text-gray-400">{title}</p>
        <p className="mt-1 text-3xl font-light text-white">{value}</p>
      </div>

      <div className="relative w-32 h-12 flex-shrink-0">
        <Chart
          options={options}
          series={[{ data }]}
          type="area"
          width="100%"
          height={48}
        />

        <div className="absolute top-1 right-2 flex flex-col items-end pointer-events-none">
          <div className="flex items-center gap-1">
            {isUp ? (
              <Image src="/upArrow.png" alt="Up" width={12} height={12} />
            ) : (
              <Image src="/downArrow.png" alt="Down" width={12} height={12} />
            )}
            <span className="text-lg font-semibold text-white">{change}%</span>
          </div>
          <span className="mt-0.5 text-[10px] text-gray-400 font-light">
            {period}
          </span>
        </div>
      </div>
    </div>
  );
}

function generateSparklineData(points: number, volatility: number) {
  let v = 50;
  const out: number[] = [];
  for (let i = 0; i < points; i++) {
    v += (Math.random() - 0.5) * volatility * 20;
    v = Math.max(0, Math.min(100, v));
    out.push(v);
  }
  return out;
}