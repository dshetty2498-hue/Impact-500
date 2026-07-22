"use client";

import { useId } from "react";
import { Download } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Sankey,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

type Datum = Record<string, string | number>;
type Series = { key: string; label: string; color?: string };
const colors = ["#60a5fa", "#3b82f6", "#22c55e", "#fbbf24", "#c084fc"];
const tooltipStyle = {
  background: "#0D1728",
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
      <figcaption className="mb-7 flex items-start justify-between gap-4">
        <span>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">{description}</p>}
        </span>
        <button
          type="button"
          onClick={(event) => exportChartPng(event.currentTarget.closest("figure"), title)}
          className="focus-ring shrink-0 rounded-xl border p-2.5 text-zinc-400 transition hover:-translate-y-0.5 hover:border-cyan/30 hover:text-cyan"
          aria-label={`Download ${title} as PNG`}
          title="Download PNG"
        >
          <Download className="size-4" />
        </button>
      </figcaption>
      <div className="h-72 w-full md:h-80">{children}</div>
    </figure>
  );
}

function exportChartPng(figure: HTMLElement | null, title: string) {
  const svg = figure?.querySelector("svg");
  if (!svg) return;
  const serialized = new XMLSerializer().serializeToString(svg);
  const source = URL.createObjectURL(
    new Blob([serialized], { type: "image/svg+xml;charset=utf-8" }),
  );
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1200, image.width * 2);
    canvas.height = Math.max(700, image.height * 2);
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#0D1728";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
    URL.revokeObjectURL(source);
  };
  image.src = source;
}

export function InteractiveBarChart({
  data,
  series,
  title,
  description,
  xKey = "label",
  domain = [0, 100],
}: {
  data: Datum[];
  series: Series[];
  title: string;
  description?: string;
  xKey?: string;
  domain?: [number, number];
}) {
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -20, right: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={domain}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />}
          {series.map((item, index) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              fill={item.color ?? colors[index]}
              radius={[7, 7, 0, 0]}
              animationDuration={900}
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
              <stop offset="0" stopColor="#60a5fa" stopOpacity=".35" />
              <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />}
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
                animationDuration={1000}
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
                animationDuration={1000}
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
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
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
          <Radar dataKey="value" stroke="#60a5fa" strokeWidth={2} fill="#3b82f6" fillOpacity={0.38} animationDuration={1000} />
          <Tooltip contentStyle={tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function MultiRadarChart({
  data,
  series,
  title,
  description,
}: {
  data: Datum[];
  series: Series[];
  title: string;
  description?: string;
}) {
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,.14)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
          {series.map((item, index) => (
            <Radar
              key={item.key}
              name={item.label}
              dataKey={item.key}
              stroke={item.color ?? colors[index % colors.length]}
              fill={item.color ?? colors[index % colors.length]}
              fillOpacity={0.08}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
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

export function InteractiveTreemap({
  data,
  title,
  description,
}: {
  data: { name: string; size: number }[];
  title: string;
  description?: string;
}) {
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap data={data} dataKey="size" nameKey="name" stroke="#07111f" fill="#3b82f6">
          <Tooltip contentStyle={tooltipStyle} />
        </Treemap>
      </ResponsiveContainer>
    </Frame>
  );
}

export function InteractiveBubbleChart({
  data,
  title,
  description,
}: {
  data: { name: string; x: number; y: number; size: number }[];
  title: string;
  description?: string;
}) {
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ left: -12, right: 12, bottom: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,.07)" />
          <XAxis
            type="number"
            dataKey="x"
            name="CSR score"
            domain={[70, 100]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Improvement"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <ZAxis type="number" dataKey="size" range={[70, 700]} name="Revenue" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle} />
          <Scatter name="Companies" data={data} fill="#60a5fa" />
        </ScatterChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function InteractiveSankey({ title, description }: { title: string; description?: string }) {
  const data = {
    nodes: [
      { name: "Sources" },
      { name: "Evidence" },
      { name: "Pillar scores" },
      { name: "Company score" },
      { name: "Industry benchmark" },
    ],
    links: [
      { source: 0, target: 1, value: 10 },
      { source: 1, target: 2, value: 9 },
      { source: 2, target: 3, value: 8 },
      { source: 3, target: 4, value: 7 },
    ],
  };
  return (
    <Frame title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          nodePadding={24}
          nodeWidth={12}
          link={{ stroke: "#3b82f6" }}
          margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
        >
          <Tooltip contentStyle={tooltipStyle} />
        </Sankey>
      </ResponsiveContainer>
    </Frame>
  );
}
