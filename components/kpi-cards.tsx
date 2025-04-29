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
      data: generateSparklineData(30, 0.4),
    },
    {
      title: "Conversions",
      value: "68%",
      change: 6,
      trend: "up" as const,
      data: generateSparklineData(30, 0.6),
    },
    {
      title: "Bounce Rate",
      value: "36%",
      change: 6,
      trend: "down" as const,
      data: generateSparklineData(30, 0.6),
    },
    {
      title: "Visit Duration",
      value: "1m 2s",
      change: 6,
      trend: "up" as const,
      data: generateSparklineData(30, 0.5),
    },
  ];

  return (
    // tighter gap between cards
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-8">
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
  data: number[];
}

function KpiCard({ title, value, change, trend, data }: KpiCardProps) {
  const isUp = trend === "up";

  // colors from mock
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
    <div
      className="
        flex items-center justify-between
        bg-[#1C1C1C] rounded-lg p-6 overflow-hidden
      "
      // very subtle border so cards read as one piece
      style={{ border: "1px solid rgba(42,42,42,0.2)" }}
    >
      {/* Left: title + value */}
      <div>
        <p className="text-xs font-medium text-gray-300">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-white">
          {value}
        </p>
      </div>

      {/* Right: sparkline + overlay */}
      <div className="relative w-24 h-12 flex-shrink-0">
        <Chart
          options={options}
          series={[{ data }]}
          type="area"
          width="100%"
          height={48}
        />

        {/* center-top overlay */}
        <div className="absolute inset-0 flex flex-col items-center pt-1 pointer-events-none">
          <div className="flex items-center gap-0">
            {isUp ? (
              <Image src="/upArrow.png" alt="Up" width={16} height={10} />
            ) : (
              <Image src="/downArrow.png" alt="Down" width={16} height={10} />
            )}
            <span className="text-lg font-semibold text-white">{change}%</span>
          </div>
          <span className="mt-0.5 text-[10px] text-gray-400 tracking-wide">
            last week
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
