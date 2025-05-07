"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function KpiCards() {
  const kpis = [
    {
      title: "Total Visits",
      value: "54,081",
      change: 2,
      trend: "up" as const,
      period: "last week",
      data: generateSparklineData(30, 0.4),
    },
    {
      title: "Conversions",
      value: "68%",
      change: 6,
      trend: "up" as const,
      period: "last week",
      data: generateSparklineData(30, 0.6),
    },
    {
      title: "Bounce Rate",
      value: "36%",
      change: 6,
      trend: "down" as const,
      period: "last week",
      data: generateSparklineData(30, 0.6),
    },
    {
      title: "Visit Duration",
      value: "1m 2s",
      change: 6,
      trend: "up" as const,
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
      {/* Left: Title + Value */}
      <div>
        {/* lighter gray title */}
        <p className="text-xs font-light text-gray-400">{title}</p>
        <p className="mt-1 text-3xl font-light text-white">{value}</p>
      </div>

      {/* Right: Sparkline + Change badge */}
      <div className="relative w-32 h-12 flex-shrink-0">
        <Chart
          options={options}
          series={[{ data }]}
          type="area"
          width="100%"
          height={48}
        />

        {/* top-right badge */}
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
