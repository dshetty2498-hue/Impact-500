import { writeFileSync } from "node:fs";
import cityTimezones from "city-timezones";
import { companies } from "../lib/data";

const rows = cityTimezones.cityMapping as Array<{
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  iso2: string;
  state_ansi: string;
  pop: number;
}>;

const output: Record<string, [number, number]> = {};
for (const company of companies) {
  const [city, state] = company.location.split(", ").map((part) => part.trim());
  const matches = rows
    .filter(
      (row) =>
        row.iso2 === "US" &&
        row.state_ansi === state &&
        [row.city, row.city_ascii].some((value) => value.toLowerCase() === city.toLowerCase()),
    )
    .sort((a, b) => b.pop - a.pop);
  if (matches[0]) output[company.slug] = [matches[0].lng, matches[0].lat];
}

writeFileSync(
  "data/headquarters-coordinates.generated.ts",
  `// Generated from company headquarters and the city-timezones geographic dataset.\nexport const headquartersCoordinates: Record<string, [number, number]> = ${JSON.stringify(output, null, 2)};\n`,
);
console.log(`Matched ${Object.keys(output).length} of ${companies.length} headquarters.`);
