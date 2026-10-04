"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import states from "us-atlas/states-10m.json";
import {
  BarChart3,
  Building2,
  Filter as FilterIcon,
  Layers3,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Users,
  X,
} from "lucide-react";
import { companies } from "@/lib/data";
import { GradeBadge } from "@/components/ui/primitives";
import { CompanyLogo } from "@/components/impact/company-logo";
import { gradeForScore, gradeHex } from "@/lib/grading";
import { headquartersCoordinates } from "@/data/headquarters-coordinates.generated";

type Company = (typeof companies)[number];
type Mode =
  | "Headquarters"
  | "Industry View"
  | "CSR Heat Map"
  | "Company Density"
  | "Top Performers"
  | "Lowest Performers";

const stateMeta: Record<string, { name: string; center: [number, number]; fips: string }> = {
  AL: { name: "Alabama", center: [-86.8, 32.8], fips: "01" },
  AK: { name: "Alaska", center: [-152, 64], fips: "02" },
  AZ: { name: "Arizona", center: [-111.9, 34.2], fips: "04" },
  AR: { name: "Arkansas", center: [-92.3, 34.9], fips: "05" },
  CA: { name: "California", center: [-119.5, 37.2], fips: "06" },
  CO: { name: "Colorado", center: [-105.5, 39], fips: "08" },
  CT: { name: "Connecticut", center: [-72.7, 41.6], fips: "09" },
  DE: { name: "Delaware", center: [-75.5, 39], fips: "10" },
  DC: { name: "Washington D.C.", center: [-77.04, 38.91], fips: "11" },
  FL: { name: "Florida", center: [-81.7, 27.8], fips: "12" },
  GA: { name: "Georgia", center: [-83.4, 32.7], fips: "13" },
  HI: { name: "Hawaii", center: [-157.9, 20.9], fips: "15" },
  ID: { name: "Idaho", center: [-114.5, 44.2], fips: "16" },
  IL: { name: "Illinois", center: [-89.2, 40], fips: "17" },
  IN: { name: "Indiana", center: [-86.1, 40], fips: "18" },
  IA: { name: "Iowa", center: [-93.5, 42], fips: "19" },
  KS: { name: "Kansas", center: [-98.4, 38.5], fips: "20" },
  KY: { name: "Kentucky", center: [-84.9, 37.5], fips: "21" },
  LA: { name: "Louisiana", center: [-91.8, 31], fips: "22" },
  ME: { name: "Maine", center: [-69, 45.2], fips: "23" },
  MD: { name: "Maryland", center: [-76.7, 39], fips: "24" },
  MA: { name: "Massachusetts", center: [-71.8, 42.3], fips: "25" },
  MI: { name: "Michigan", center: [-85.4, 44.3], fips: "26" },
  MN: { name: "Minnesota", center: [-94.3, 46], fips: "27" },
  MS: { name: "Mississippi", center: [-89.7, 32.7], fips: "28" },
  MO: { name: "Missouri", center: [-92.5, 38.4], fips: "29" },
  MT: { name: "Montana", center: [-110.4, 47], fips: "30" },
  NE: { name: "Nebraska", center: [-99.8, 41.5], fips: "31" },
  NV: { name: "Nevada", center: [-116.6, 39], fips: "32" },
  NH: { name: "New Hampshire", center: [-71.6, 43.7], fips: "33" },
  NJ: { name: "New Jersey", center: [-74.5, 40.1], fips: "34" },
  NM: { name: "New Mexico", center: [-106, 34.5], fips: "35" },
  NY: { name: "New York", center: [-75.5, 43], fips: "36" },
  NC: { name: "North Carolina", center: [-79.4, 35.5], fips: "37" },
  ND: { name: "North Dakota", center: [-100.5, 47.5], fips: "38" },
  OH: { name: "Ohio", center: [-82.8, 40.3], fips: "39" },
  OK: { name: "Oklahoma", center: [-97.5, 35.6], fips: "40" },
  OR: { name: "Oregon", center: [-120.5, 44], fips: "41" },
  PA: { name: "Pennsylvania", center: [-77.7, 41], fips: "42" },
  RI: { name: "Rhode Island", center: [-71.5, 41.7], fips: "44" },
  SC: { name: "South Carolina", center: [-80.9, 33.8], fips: "45" },
  SD: { name: "South Dakota", center: [-100, 44.5], fips: "46" },
  TN: { name: "Tennessee", center: [-86.3, 35.8], fips: "47" },
  TX: { name: "Texas", center: [-99.3, 31.5], fips: "48" },
  UT: { name: "Utah", center: [-111.7, 39.3], fips: "49" },
  VT: { name: "Vermont", center: [-72.7, 44], fips: "50" },
  VA: { name: "Virginia", center: [-78.7, 37.7], fips: "51" },
  WA: { name: "Washington", center: [-120.7, 47.4], fips: "53" },
  WV: { name: "West Virginia", center: [-80.6, 38.6], fips: "54" },
  WI: { name: "Wisconsin", center: [-89.9, 44.5], fips: "55" },
  WY: { name: "Wyoming", center: [-107.6, 43], fips: "56" },
};
const fipsToCode = Object.fromEntries(
  Object.entries(stateMeta).map(([code, value]) => [String(Number(value.fips)), code]),
);
const stateCode = (company: Company) => company.location.split(", ").at(-1)?.trim() ?? "";
const cityName = (company: Company) =>
  company.location.split(",")[0]?.trim() ?? company.headquarters;
const hash = (value: string) =>
  [...value].reduce((total, character) => total * 31 + character.charCodeAt(0), 7);
const coordinateFor = (company: Company): [number, number] => {
  if (headquartersCoordinates[company.slug]) return headquartersCoordinates[company.slug];
  const state = stateMeta[stateCode(company)] ?? stateMeta.DC;
  const seed = hash(cityName(company));
  const spread = ["CT", "DE", "DC", "MA", "MD", "NJ", "RI"].includes(stateCode(company))
    ? 0.35
    : 1.15;
  return [
    state.center[0] + (((seed % 19) - 9) * spread) / 10,
    state.center[1] + ((((seed >> 3) % 15) - 7) * spread) / 10,
  ];
};
const industryColors = [
  "#38bdf8",
  "#818cf8",
  "#34d399",
  "#f59e0b",
  "#f472b6",
  "#a78bfa",
  "#22d3ee",
  "#fb7185",
];

export function CompanyMap() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const [state, setState] = useState("All");
  const [grade, setGrade] = useState("All");
  const [rank, setRank] = useState("500");
  const [score, setScore] = useState("0");
  const [revenue, setRevenue] = useState("0");
  const [employees, setEmployees] = useState("0");
  const [founded, setFounded] = useState("0");
  const [mode, setMode] = useState<Mode>("Headquarters");
  const [active, setActive] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([-96, 38]);
  const industryPalette = useMemo(
    () =>
      new Map(
        [...new Set(companies.map((c) => c.industry))].map((value, index) => [
          value,
          industryColors[index % industryColors.length],
        ]),
      ),
    [],
  );
  const rows = useMemo(
    () =>
      companies.filter((company) => {
        const haystack =
          `${company.name} ${company.headquarters} ${company.ceo ?? company.executive?.name ?? ""} ${company.industry}`.toLowerCase();
        const modeMatch =
          mode === "Top Performers"
            ? company.grade === "A"
            : mode === "Lowest Performers"
              ? company.score < 70
              : true;
        return (
          modeMatch &&
          (industry === "All" || company.industry === industry) &&
          (state === "All" || stateCode(company) === state) &&
          (grade === "All" || company.grade === grade) &&
          (company.fortuneRank ?? 999) <= Number(rank) &&
          company.score >= Number(score) &&
          company.revenueBillions >= Number(revenue) &&
          company.employees >= Number(employees) &&
          (company.founded ?? 0) >= Number(founded) &&
          haystack.includes(query.toLowerCase())
        );
      }),
    [employees, founded, grade, industry, mode, query, rank, revenue, score, state],
  );
  const stateStats = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(stateMeta).map((code) => {
          const list = rows.filter((c) => stateCode(c) === code);
          return [
            code,
            {
              list,
              count: list.length,
              average: list.length ? list.reduce((s, c) => s + c.score, 0) / list.length : 0,
              revenue: list.reduce((s, c) => s + c.revenueBillions, 0),
            },
          ];
        }),
      ),
    [rows],
  );
  const clusters = useMemo(() => {
    const groups = new Map<string, Company[]>();
    rows.forEach((c) => {
      const key = c.headquarters;
      groups.set(key, [...(groups.get(key) ?? []), c]);
    });
    return [...groups.entries()].map(([key, list]) => ({
      key,
      list,
      coordinate: coordinateFor(list[0]),
    }));
  }, [rows]);
  const selected = companies.find((c) => c.slug === active);
  const insight = selectedState ? stateStats[selectedState] : null;
  const reset = () => {
    setQuery("");
    setIndustry("All");
    setState("All");
    setGrade("All");
    setRank("500");
    setScore("0");
    setRevenue("0");
    setEmployees("0");
    setFounded("0");
    setMode("Headquarters");
    setActive(null);
    setSelectedState(null);
    setCenter([-96, 38]);
    setZoom(1);
  };
  const chooseCompany = (company: Company) => {
    setActive(company.slug);
    setCenter(coordinateFor(company));
    setZoom(4);
  };
  const stateFill = (code: string) => {
    const stat = stateStats[code];
    if (!stat?.count) return "#111b32";
    if (mode === "CSR Heat Map") return gradeHex(gradeForScore(stat.average));
    if (mode === "Company Density")
      return `rgba(56,189,248,${Math.min(0.18 + stat.count / 30, 0.9)})`;
    return selectedState === code ? "#1d4ed8" : "#17233d";
  };
  return (
    <div className="relative">
      <div className="sticky top-24 z-30 mb-4 flex gap-3 rounded-2xl border bg-ink/90 p-3 shadow-2xl backdrop-blur-xl">
        <label className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-cyan" />
          <input
            list="map-company-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              const match = companies.find(
                (company) => company.name.toLowerCase() === e.target.value.toLowerCase(),
              );
              if (match) chooseCompany(match);
            }}
            placeholder="Search company, city, state, CEO, or industry"
            className="form-control w-full pl-11"
          />
          <datalist id="map-company-search">
            {companies.map((company) => (
              <option key={company.slug} value={company.name}>
                {company.headquarters}
              </option>
            ))}
          </datalist>
        </label>
        <button className="button-secondary lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
          <FilterIcon className="size-4" /> Filters
        </button>
        <button className="button-secondary hidden lg:inline-flex" onClick={reset}>
          <RotateCcw className="size-4" /> Reset
        </button>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {(
          [
            "Headquarters",
            "Industry View",
            "CSR Heat Map",
            "Company Density",
            "Top Performers",
            "Lowest Performers",
          ] as Mode[]
        ).map((item) => (
          <button
            key={item}
            onClick={() => setMode(item)}
            className={`min-w-max rounded-full border px-4 py-2 text-xs font-semibold transition ${mode === item ? "border-cyan/50 bg-cyan/15 text-cyan" : "bg-panel text-zinc-400 hover:text-white"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside
          className={`${filtersOpen ? "fixed inset-0 z-50 overflow-y-auto bg-ink p-5" : "hidden"} rounded-2xl border bg-panel/80 p-5 xl:block`}
        >
          <div className="mb-5 flex items-center justify-between">
            <strong className="flex items-center gap-2">
              <FilterIcon className="size-4 text-cyan" />
              Map filters
            </strong>
            <button className="xl:hidden" onClick={() => setFiltersOpen(false)}>
              <X />
            </button>
          </div>
          <div className="space-y-4">
            <Filter
              label="Industry"
              value={industry}
              set={setIndustry}
              values={[...new Set(companies.map((c) => c.industry))]}
            />
            <Filter label="State" value={state} set={setState} values={Object.keys(stateMeta)} />
            <Filter
              label="Letter grade"
              value={grade}
              set={setGrade}
              values={["A", "B", "C", "D", "F"]}
            />
            <Filter
              label="Fortune rank ≤"
              value={rank}
              set={setRank}
              values={["100", "200", "300", "400", "500"]}
              all={false}
            />
            <Filter
              label="CSR score ≥"
              value={score}
              set={setScore}
              values={["0", "60", "70", "80", "90"]}
              all={false}
            />
            <Filter
              label="Revenue ($B) ≥"
              value={revenue}
              set={setRevenue}
              values={["0", "5", "10", "25", "50", "100"]}
              all={false}
            />
            <Filter
              label="Employees ≥"
              value={employees}
              set={setEmployees}
              values={["0", "10000", "50000", "100000", "250000"]}
              all={false}
            />
            <Filter
              label="Founded since"
              value={founded}
              set={setFounded}
              values={["0", "1900", "1950", "1980", "2000"]}
              all={false}
            />
          </div>
          <button
            className="button-secondary mt-6 w-full xl:hidden"
            onClick={() => {
              setFiltersOpen(false);
            }}
          >
            Apply filters
          </button>
        </aside>
        <div className="relative min-h-[38rem] overflow-hidden rounded-2xl border bg-[#07101f] shadow-2xl md:min-h-[48rem]">
          <div className="absolute left-4 top-4 z-20 rounded-xl border bg-ink/80 px-4 py-3 text-xs text-zinc-400 backdrop-blur">
            <strong className="text-white">{rows.length}</strong> companies ·{" "}
            <strong className="text-white">{clusters.length}</strong> locations
          </div>
          <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-xl border bg-ink/85 shadow-xl">
            <button
              aria-label="Zoom in"
              className="p-3 hover:bg-white/10"
              onClick={() => setZoom(Math.min(zoom * 1.5, 8))}
            >
              <Plus className="size-4" />
            </button>
            <button
              aria-label="Zoom out"
              className="border-t p-3 hover:bg-white/10"
              onClick={() => setZoom(Math.max(zoom / 1.5, 1))}
            >
              <Minus className="size-4" />
            </button>
          </div>
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 1120 }}
            width={980}
            height={610}
            className="h-full min-h-[38rem] w-full md:min-h-[48rem]"
            aria-label={`Interactive United States map showing ${rows.length} company headquarters`}
          >
            <ZoomableGroup
              className="impact-map-zoom"
              center={center}
              zoom={zoom}
              minZoom={1}
              maxZoom={8}
              onMoveEnd={({ coordinates, zoom: nextZoom }) => {
                setCenter(coordinates as [number, number]);
                setZoom(nextZoom);
              }}
            >
              <Geographies geography={states}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const code = fipsToCode[String(Number(geo.id))];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        role="button"
                        tabIndex={0}
                        aria-label={code ? `Filter map to ${code}` : "Map region"}
                        onClick={() => code && setSelectedState(code)}
                        onKeyDown={(event) => {
                          if (code && (event.key === "Enter" || event.key === " ")) {
                            event.preventDefault();
                            setSelectedState(code);
                          }
                        }}
                        fill={stateFill(code)}
                        stroke={selectedState === code ? "#7dd3fc" : "#334155"}
                        strokeWidth={selectedState === code ? 1.4 : 0.55}
                        style={{
                          default: { outline: "none", transition: "fill .25s" },
                          hover: { fill: "#1e3a5f", outline: "none", cursor: "pointer" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              {clusters.map((cluster) => {
                const primary = cluster.list[0];
                const expanded = zoom >= 3 || cluster.list.length === 1;
                if (expanded && cluster.list.length > 1) {
                  return cluster.list.map((company, index) => {
                    const angle = (index / cluster.list.length) * Math.PI * 2;
                    const radius = 0.12 + Math.floor(index / 10) * 0.08;
                    const coordinate: [number, number] = [
                      cluster.coordinate[0] + Math.cos(angle) * radius,
                      cluster.coordinate[1] + Math.sin(angle) * radius,
                    ];
                    const markerColor =
                      mode === "Industry View"
                        ? (industryPalette.get(company.industry) ?? "#38bdf8")
                        : gradeHex(gradeForScore(company.score));
                    return (
                      <Marker key={company.slug} coordinates={coordinate}>
                        <g
                          role="button"
                          tabIndex={0}
                          aria-label={`${company.name}, ${company.headquarters}`}
                          onClick={() => chooseCompany(company)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              chooseCompany(company);
                            }
                          }}
                          className="cursor-pointer outline-none"
                        >
                          {active === company.slug && (
                            <circle
                              r={10 / zoom}
                              fill="none"
                              stroke="#fff"
                              strokeWidth={1 / zoom}
                              className="animate-ping"
                            />
                          )}
                          <circle
                            r={5 / Math.sqrt(zoom)}
                            fill={markerColor}
                            stroke="#07101f"
                            strokeWidth={2 / zoom}
                          />
                        </g>
                      </Marker>
                    );
                  });
                }
                const color =
                  mode === "Industry View"
                    ? (industryPalette.get(primary.industry) ?? "#38bdf8")
                    : gradeHex(gradeForScore(primary.score));
                return (
                  <Marker key={cluster.key} coordinates={cluster.coordinate}>
                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={`${cluster.list.length} companies in ${cluster.key}`}
                      onClick={() =>
                        expanded
                          ? chooseCompany(primary)
                          : (setCenter(cluster.coordinate), setZoom(4))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          if (expanded) {
                            chooseCompany(primary);
                          } else {
                            setCenter(cluster.coordinate);
                            setZoom(4);
                          }
                        }
                      }}
                      className="cursor-pointer outline-none"
                    >
                      {active === primary.slug && (
                        <circle
                          r={12 / zoom}
                          fill="none"
                          stroke="#fff"
                          strokeWidth={1 / zoom}
                          className="animate-ping"
                        />
                      )}
                      <circle
                        r={(expanded ? 5 : Math.min(7 + cluster.list.length, 18)) / Math.sqrt(zoom)}
                        fill={color}
                        stroke="#07101f"
                        strokeWidth={2 / zoom}
                        opacity={0.95}
                      />
                      {!expanded && (
                        <text
                          textAnchor="middle"
                          y={2.5 / zoom}
                          fontSize={7 / zoom}
                          fill="white"
                          fontWeight="700"
                        >
                          {cluster.list.length}
                        </text>
                      )}
                    </g>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-xl border bg-ink/85 px-4 py-3 text-xs text-zinc-400 backdrop-blur">
            <Layers3 className="size-4 text-cyan" />
            {mode} · scroll or controls to zoom
          </div>
          {selected && <CompanyPopup company={selected} close={() => setActive(null)} />}{" "}
          {insight && (
            <StatePanel
              code={selectedState!}
              stat={insight}
              close={() => setSelectedState(null)}
              select={chooseCompany}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CompanyPopup({ company, close }: { company: Company; close: () => void }) {
  return (
    <div className="absolute inset-x-3 bottom-3 z-30 rounded-2xl border bg-ink/95 p-5 shadow-2xl backdrop-blur-xl sm:inset-auto sm:right-5 sm:top-20 sm:w-80">
      <button onClick={close} className="absolute right-3 top-3 text-zinc-500">
        <X className="size-4" />
      </button>
      <div className="flex items-center gap-3 pr-6">
        <CompanyLogo name={company.name} website={company.website} logo={company.logo} size="lg" />
        <div>
          <h2 className="font-semibold">{company.name}</h2>
          <p className="text-xs text-cyan">
            Fortune #{company.fortuneRank ?? "Data unavailable"} ·{" "}
            <Link href={`/industries/${company.industrySlug}`} className="hover:underline">
              {company.industry}
            </Link>
          </p>
        </div>
      </div>
      <p className="mt-4 flex gap-2 text-xs text-zinc-500">
        <MapPin className="size-3" />
        {company.headquarters}
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        CEO: {company.executive?.name ?? "Data unavailable"}
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        Founded: {company.founded ?? "Data unavailable"}
      </p>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">{company.summary}</p>
      <div className="mt-4 flex items-end justify-between">
        <strong className="display text-3xl text-cyan">{company.score.toFixed(1)}</strong>
        <GradeBadge score={company.score} />
      </div>
      <Link
        href={`/companies/${company.slug}`}
        className="button-primary mt-5 w-full justify-center"
      >
        View Company Profile
      </Link>
    </div>
  );
}

function StatePanel({
  code,
  stat,
  close,
  select,
}: {
  code: string;
  stat: { list: Company[]; count: number; average: number; revenue: number };
  close: () => void;
  select: (company: Company) => void;
}) {
  const industries = Object.entries(
    stat.list.reduce<Record<string, number>>(
      (a, c) => ({ ...a, [c.industry]: (a[c.industry] ?? 0) + 1 }),
      {},
    ),
  ).sort((a, b) => b[1] - a[1]);
  const top = [...stat.list].sort((a, b) => b.score - a.score)[0];
  return (
    <aside className="absolute inset-y-3 right-3 z-40 w-[calc(100%-1.5rem)] overflow-y-auto rounded-2xl border bg-ink/95 p-6 shadow-2xl backdrop-blur-xl sm:w-96">
      <button onClick={close} className="absolute right-4 top-4">
        <X className="size-4" />
      </button>
      <p className="text-xs uppercase tracking-wider text-cyan">State intelligence</p>
      <h2 className="display mt-2 text-3xl">{stateMeta[code]?.name}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Metric icon={<Building2 />} label="Companies" value={String(stat.count)} />
        <Metric
          icon={<BarChart3 />}
          label="Average CSR"
          value={stat.count ? stat.average.toFixed(1) : "—"}
        />
        <Metric icon={<Users />} label="Leading sector" value={industries[0]?.[0] ?? "—"} />
        <Metric icon={<Layers3 />} label="Revenue" value={`$${stat.revenue.toFixed(1)}B`} />
      </div>
      {top && (
        <div className="mt-5 rounded-xl border bg-white/[.03] p-4">
          <small className="text-zinc-500">Top company</small>
          <strong className="mt-1 block">
            {top.name} · {top.score.toFixed(1)}
          </strong>
        </div>
      )}
      <div className="mt-6 rounded-xl border bg-white/[.025] p-4">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Industry concentration</p>
        <div className="mt-4 space-y-3">
          {industries.slice(0, 5).map(([name, count]) => (
            <button key={name} className="block w-full text-left" title={`${count} companies`}>
              <span className="flex justify-between text-xs">
                <span className="truncate text-zinc-300">{name}</span>
                <span className="text-cyan">{count}</span>
              </span>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-cyan transition-all"
                  style={{ width: `${(count / Math.max(stat.count, 1)) * 100}%` }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-2">
        {[...stat.list]
          .sort((a, b) => b.score - a.score)
          .map((company) => (
            <button
              key={company.slug}
              onClick={() => select(company)}
              className="flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:bg-white/5"
            >
              <CompanyLogo
                name={company.name}
                website={company.website}
                logo={company.logo}
                size="sm"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{company.name}</span>
                <span className="block truncate text-xs text-zinc-500">
                  CEO {company.executive?.name}
                </span>
              </span>
              <span className="text-sm text-cyan">{company.score.toFixed(1)}</span>
            </button>
          ))}
      </div>
    </aside>
  );
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white/[.03] p-4">
      <span className="block size-4 text-cyan">{icon}</span>
      <strong className="mt-3 block text-lg">{value}</strong>
      <small className="text-zinc-500">{label}</small>
    </div>
  );
}
function Filter({
  label,
  value,
  set,
  values,
  all = true,
}: {
  label: string;
  value: string;
  set: (value: string) => void;
  values: string[];
  all?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-zinc-400">
      {label}
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="form-control mt-2 w-full"
      >
        {all && <option>All</option>}
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
