"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = Record<string, string | number>;
type Series = { key: string; label: string; color?: string };
const colors = ["#6ee7f9", "#4f7eff", "#34d399", "#fbbf24", "#c084fc"];
const tooltipStyle = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 10,
};

function Frame({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="min-w-0" aria-label={description ?? title}>
      <figcaption className="mb-5">
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </figcaption>
      <div className="h-64 w-full">{children}</div>
    </figure>
  );
}

export function InteractiveBarChart({
  data,
  series,
  title,
  description,
  xKey = "label",
}: {
  data: Datum[];
  series: Series[];
  title: string;
  description?: string;
  xKey?: string;
}) {
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -20, right: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          {series.map((item, index) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              fill={item.color ?? colors[index]}
              radius={[5, 5, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function InteractiveLineChart({
  data,
  series,
  title,
  description,
  xKey = "label",
  area = false,
}: {
  data: Datum[];
  series: Series[];
  title: string;
  description?: string;
  xKey?: string;
  area?: boolean;
}) {
  const gradientId = useId().replaceAll(":", "");
  const Chart = area ? AreaChart : LineChart;
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ left: -20, right: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6ee7f9" stopOpacity=".35" />
              <stop offset="1" stopColor="#6ee7f9" stopOpacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          {series.map((item, index) =>
            area ? (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={item.color ?? colors[index]}
                fill={`url(#${gradientId})`}
                strokeWidth={2}
              />
            ) : (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={item.color ?? colors[index]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ),
          )}
        </Chart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function InteractivePieChart({
  data,
  title,
  description,
}: {
  data: { name: string; value: number }[];
  title: string;
  description?: string;
}) {
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="52%"
            outerRadius="82%"
            paddingAngle={3}
          >
            {data.map((item, index) => (
              <Cell key={item.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function InteractiveRadarChart({
  data,
  title,
  description,
}: {
  data: { subject: string; value: number }[];
  title: string;
  description?: string;
}) {
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,.14)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
          <Radar dataKey="value" stroke="#6ee7f9" fill="#4f7eff" fillOpacity={0.38} />
          <Tooltip contentStyle={tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function HeatMap({
  data,
  title,
  description,
}: {
  data: { label: string; values: number[] }[];
  title: string;
  description?: string;
}) {
  return (
    <Frame title={title} description={description}>
      <div
        className="grid h-full content-center gap-2"
        role="img"
        aria-label={description ?? title}
      >
        {data.map((row) => (
          <div className="grid grid-cols-[5rem_repeat(5,1fr)] gap-2" key={row.label}>
            <span className="self-center truncate text-xs text-zinc-400">{row.label}</span>
            {row.values.map((value, index) => (
              <span
                key={index}
                title={`${row.label}: ${value}`}
                className="grid aspect-square max-h-12 place-items-center rounded text-xs text-white"
                style={{ backgroundColor: `rgb(79 126 255 / ${Math.max(0.15, value / 100)})` }}
              >
                {value}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}
