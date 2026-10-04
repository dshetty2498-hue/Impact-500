"""Build the centralized company-founding enrichment from open reference data.

The generator deliberately keeps the source entity and a review status beside
each date. It never guesses a year: unmatched or ambiguous companies are
written as unresolved records for manual verification.
"""

from __future__ import annotations

import concurrent.futures
import datetime as dt
import ast
import csv
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path


SOURCE = Path("data/fortune-500-2026.generated.ts")
TARGET = Path("data/company-foundings.generated.ts")
API = "https://www.wikidata.org/w/api.php"
WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
SPARQL_API = "https://query.wikidata.org/sparql"
USER_AGENT = "ImpactHorizonResearch/1.0 (company-history-verification)"
WIKIPEDIA_TITLE_ALIASES = {
    "UPS": "United Parcel Service",
    "Nationwide": "Nationwide Mutual Insurance Company",
    "Galaxy Digital": "Galaxy Digital Holdings",
    "Ingram Micro Holding": "Ingram Micro",
    "Massachusetts Mutual Life": "MassMutual",
    "Bank of New York (BNY)": "BNY",
    "US Foods Holding": "US Foods",
    "World Kinect": "World Kinect Corporation",
    "Medline": "Medline Industries",
    "Lear": "Lear Corporation",
    "Synchrony": "Synchrony Financial",
    "BJ’s Wholesale Club": "BJ's Wholesale Club",
    "Guardian Life Ins. Co. of America": "The Guardian Life Insurance Company of America",
    "Peter Kiewit Sons’": "Kiewit Corporation",
    "Jones Financial (Edward Jones)": "Edward Jones Investments",
    "LPL Financial Holdings": "LPL Financial",
    "Land O’Lakes": "Land O'Lakes",
    "Casey’s General Stores": "Casey's",
    "Whirlpool": "Whirlpool Corporation",
    "Fluor": "Fluor Corporation",
    "Reliance": "Reliance, Inc.",
    "Venture Global": "Venture Global LNG",
    "Thrivent Financial": "Thrivent",
    "Westlake": "Westlake Corporation",
    "FM": "FM Global",
    "Expeditors Intl. of Washington": "Expeditors International",
    "Andersons": "The Andersons",
    "Fidelity National Information (FIS)": "FIS (company)",
    "Oshkosh": "Oshkosh Corporation",
    "Campbell’s": "The Campbell's Company",
    "Dana": "Dana Incorporated",
    "VF": "VF Corporation",
    "Seaboard": "Seaboard Corporation",
    "PVH": "PVH Corp.",
    "NOV": "NOV Inc.",
    "Graphic Packaging Holding": "Graphic Packaging International",
    "KBR": "KBR, Inc.",
    "Primoris Services": "Primoris Services Corporation",
}
OFFICIAL_OVERRIDES: dict[str, dict[str, object]] = {
    "Galaxy Digital": {
        "founded": 2018,
        "sourceTitle": "Galaxy origin story",
        "sourceUrl": "https://www.galaxydigital.io/about/",
    },
    "GuideWell Mutual Holding": {
        "founded": 1944,
        "modernEstablished": 2013,
        "sourceTitle": "GuideWell company history",
        "sourceUrl": "https://www.guidewell.com/who-we-are/our-story",
    },
    "Gold.com": {
        "founded": 1965,
        "modernEstablished": 2025,
        "sourceTitle": "Gold.com corporate history",
        "sourceUrl": "https://www.gold.com/corporate-history/",
    },
    "Thrivent Financial": {
        "founded": 1902,
        "modernEstablished": 2002,
        "sourceTitle": "Thrivent company history",
        "sourceUrl": "https://www.thrivent.com/about-us/history",
    },
    "APi Group": {
        "founded": 1926,
        "modernEstablished": 1997,
        "sourceTitle": "APi Group 2025 annual report — company timeline",
        "sourceUrl": "https://www.sec.gov/Archives/edgar/data/0001796209/000162828026023530/apigroup2025annualreport.pdf",
    },
    "Coterra Energy": {
        "founded": 2021,
        "sourceTitle": "Cabot and Cimarex combination forming Coterra Energy",
        "sourceUrl": "https://www.coterra.com/wp-content/uploads/2021/10/Cabot-Oil-Gas-and-Cimarex-Energy-Complete-Combination-Forming-Coterra-Energy.pdf",
    },
    "Resideo Technologies": {
        "founded": 2018,
        "sourceTitle": "Resideo standalone-company announcement",
        "sourceUrl": "https://www.resideo.com/us/en/corporate/newsroom/all-articles/Resideo-Announces-Third-Quarter-2018-Financial-Results/",
    },
}


def company_rows() -> list[list[object]]:
    text = SOURCE.read_text(encoding="utf-8")
    start = text.index("export const fortune5002026 =")
    start = text.index("[", start)
    end = text.index("] as const", start) + 1
    fragment = text[start:end]
    pattern = re.compile(r"\[\s*(\d+)\s*,\s*((?:\"(?:\\.|[^\"])*\")|(?:'(?:\\.|[^'])*'))\s*,")
    rows = [[int(match.group(1)), ast.literal_eval(match.group(2))] for match in pattern.finditer(fragment)]
    if len(rows) != 500:
        raise RuntimeError(f"Expected 500 company rows, found {len(rows)}")
    return rows


def normalized(value: str) -> str:
    value = value.lower().replace("&", "and")
    value = re.sub(
        r"\b(the|and|incorporated|inc|corporation|corp|company|companies|co|group|holdings|holding|plc|lp|llc|class [ac]|international|technologies|technology|systems)\b",
        " ",
        value,
    )
    return re.sub(r"[^a-z0-9]", "", value)


def request(params: dict[str, str], api: str = API) -> dict:
    url = f"{api}?{urllib.parse.urlencode(params)}"
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=25) as response:
                return json.load(response)
        except Exception:
            if attempt == 3:
                raise
            time.sleep(1.5 * (attempt + 1))
    return {}


def sparql_request(query: str) -> dict:
    url = f"{SPARQL_API}?{urllib.parse.urlencode({'query': query, 'format': 'json'})}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json"},
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.load(response)


def exact_label_records(names: list[str]) -> list[dict[str, object]]:
    found: dict[str, list[dict[str, str]]] = {name: [] for name in names}
    for offset in range(0, len(names), 35):
        batch = names[offset : offset + 35]
        values = " ".join(f"{json.dumps(name)}@en" for name in batch)
        query = f"""
          SELECT ?item ?label ?inception ?description WHERE {{
            VALUES ?label {{ {values} }}
            ?item rdfs:label ?label; wdt:P571 ?inception.
            OPTIONAL {{ ?item schema:description ?description.
                       FILTER(LANG(?description) = \"en\") }}
          }}
        """
        payload = sparql_request(query)
        for binding in payload.get("results", {}).get("bindings", []):
            label = binding["label"]["value"]
            if label in found:
                found[label].append(
                    {
                        "entity": binding["item"]["value"].rsplit("/", 1)[-1],
                        "description": binding.get("description", {}).get("value", ""),
                        "time": binding["inception"]["value"],
                    }
                )
        time.sleep(0.4)

    business_terms = re.compile(
        r"company|corporation|retailer|manufacturer|bank|airline|business|enterprise|conglomerate|insurer|pharmaceutical|technology|energy|restaurant|chain|distributor|services",
        re.I,
    )
    records: list[dict[str, object]] = []
    for name in names:
        candidates = found[name]
        preferred = [item for item in candidates if business_terms.search(item["description"])]
        pool = preferred or candidates
        dated: list[tuple[int, dict[str, str]]] = []
        for item in pool:
            match = re.match(r"^(\d{4})-", item["time"])
            if match and 1500 <= int(match.group(1)) <= dt.date.today().year:
                dated.append((int(match.group(1)), item))
        if not dated:
            records.append({"name": name, "status": "unresolved"})
            continue
        founded, item = min(dated, key=lambda pair: pair[0])
        records.append(
            {
                "name": name,
                "entity": item["entity"],
                "label": name,
                "description": item["description"],
                "founded": founded,
                "status": "verified",
            }
        )
    return records


def find_entity(name: str) -> dict[str, object]:
    payload = request(
        {
            "action": "wbsearchentities",
            "search": name,
            "language": "en",
            "uselang": "en",
            "type": "item",
            "limit": "8",
            "format": "json",
            "origin": "*",
        }
    )
    candidates = payload.get("search", [])
    target = normalized(name)
    business_terms = re.compile(
        r"company|corporation|retailer|manufacturer|bank|airline|business|enterprise|conglomerate|insurer|pharmaceutical|technology|energy|restaurant|chain|distributor|services",
        re.I,
    )
    scored: list[tuple[int, dict]] = []
    for candidate in candidates:
        label = str(candidate.get("label", ""))
        description = str(candidate.get("description", ""))
        label_key = normalized(label)
        score = 0
        if label_key == target:
            score += 10
        elif target in label_key or label_key in target:
            score += 4
        if business_terms.search(description):
            score += 4
        if re.search(r"film|album|song|person|surname|given name|village|town|ship", description, re.I):
            score -= 8
        scored.append((score, candidate))
    if not scored:
        return {"name": name, "status": "unresolved"}
    score, best = max(scored, key=lambda item: item[0])
    if score < 8:
        return {"name": name, "status": "unresolved"}
    return {
        "name": name,
        "entity": best["id"],
        "label": best.get("label", name),
        "description": best.get("description", ""),
        "matchScore": score,
        "status": "candidate",
    }


def load_dates(candidates: list[dict[str, object]]) -> None:
    by_id = {str(item["entity"]): item for item in candidates if item.get("entity")}
    ids = list(by_id)
    for offset in range(0, len(ids), 50):
        batch = ids[offset : offset + 50]
        payload = request(
            {
                "action": "wbgetentities",
                "ids": "|".join(batch),
                "props": "claims",
                "format": "json",
                "origin": "*",
            }
        )
        for entity_id, entity in payload.get("entities", {}).items():
            record = by_id[entity_id]
            values: list[int] = []
            for claim in entity.get("claims", {}).get("P571", []):
                value = claim.get("mainsnak", {}).get("datavalue", {}).get("value", {})
                raw = value.get("time") if isinstance(value, dict) else None
                match = re.match(r"^[+-](\d{4,})-", str(raw or ""))
                if match:
                    year = int(match.group(1))
                    if 1500 <= year <= dt.date.today().year:
                        values.append(year)
            if values:
                record["founded"] = min(values)
                record["status"] = "verified"
            else:
                record["status"] = "unresolved"


def wikipedia_records(names: list[str]) -> dict[str, dict[str, object]]:
    """Resolve exact/redirected company pages and read only their founded infobox field."""
    resolved: dict[str, dict[str, object]] = {}
    for offset in range(0, len(names), 40):
        batch = names[offset : offset + 40]
        requested_titles = [WIKIPEDIA_TITLE_ALIASES.get(name, name) for name in batch]
        payload = request(
            {
                "action": "query",
                "titles": "|".join(requested_titles),
                "redirects": "1",
                "prop": "revisions",
                "rvprop": "content",
                "rvslots": "main",
                "formatversion": "2",
                "format": "json",
                "origin": "*",
            },
            WIKIPEDIA_API,
        )
        redirects = {
            item["from"]: item["to"] for item in payload.get("query", {}).get("redirects", [])
        }
        normalized_titles = {
            item["from"]: item["to"] for item in payload.get("query", {}).get("normalized", [])
        }
        pages = {
            page.get("title"): page
            for page in payload.get("query", {}).get("pages", [])
            if not page.get("missing")
        }
        for name in batch:
            requested_title = WIKIPEDIA_TITLE_ALIASES.get(name, name)
            title = normalized_titles.get(requested_title, requested_title)
            title = redirects.get(title, title)
            page = pages.get(title)
            if not page or not page.get("revisions"):
                continue
            content = page["revisions"][0].get("slots", {}).get("main", {}).get("content", "")
            field = re.search(
                r"^\|\s*(?:founded|foundation)\s*=\s*(.*?)(?=^\|\s*[a-zA-Z_ ]+\s*=|\n}})",
                content,
                flags=re.MULTILINE | re.DOTALL | re.IGNORECASE,
            )
            if not field:
                continue
            years = [
                int(value)
                for value in re.findall(r"\b(?:1[5-9]|20)\d{2}\b", field.group(1))
                if 1500 <= int(value) <= dt.date.today().year
            ]
            if not years:
                continue
            resolved[name] = {
                "name": name,
                "founded": min(years),
                "modernEstablished": max(years) if len(set(years)) > 1 else None,
                "sourceTitle": f"{title} — company history",
                "sourceUrl": f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}",
                "status": "verified",
            }
        time.sleep(0.4)
    return resolved


def main() -> None:
    rows = company_rows()
    sp500_path = Path("/tmp/sp500-constituents.csv")
    founders_path = Path("/tmp/founders-companies.csv")
    if not sp500_path.exists() or not founders_path.exists():
        raise RuntimeError("Download the documented reference CSV files before running this generator")

    sp500: dict[str, dict[str, str]] = {}
    with sp500_path.open(encoding="utf-8") as handle:
        for item in csv.DictReader(handle):
            sp500[normalized(item["Security"])] = item

    founders: dict[str, list[dict[str, str]]] = {}
    with founders_path.open(encoding="utf-8") as handle:
        for item in csv.DictReader(handle):
            if not item.get("founded_year", "").isdigit():
                continue
            founders.setdefault(normalized(item["name"]), []).append(item)

    records: list[dict[str, object]] = []
    for _, raw_name in rows:
        name = str(raw_name)
        key = normalized(name)
        if key in sp500:
            item = sp500[key]
            years = [int(value) for value in re.findall(r"\b(?:1[5-9]|20)\d{2}\b", item["Founded"])]
            if years:
                records.append(
                    {
                        "name": name,
                        "founded": min(years),
                        "modernEstablished": max(years) if len(set(years)) > 1 else None,
                        "sourceTitle": "S&P 500 company reference — founding year",
                        "sourceUrl": "https://github.com/datasets/s-and-p-500-companies/blob/main/data/constituents.csv",
                        "status": "verified",
                    }
                )
                continue
        records.append({"name": name, "status": "unresolved"})
    unresolved_names = [str(record["name"]) for record in records if record["status"] == "unresolved"]
    wikipedia = wikipedia_records(unresolved_names)
    records = [wikipedia.get(str(record["name"]), record) for record in records]
    for index, record in enumerate(records):
        if record["status"] != "unresolved":
            continue
        candidates = founders.get(normalized(str(record["name"])), [])
        if not candidates:
            continue
        candidates.sort(
            key=lambda item: (
                item.get("hq_country", "").lower() in {"united states", "usa", "us"},
                item.get("status", "").lower() != "defunct",
                bool(item.get("wikipedia_url")),
            ),
            reverse=True,
        )
        item = candidates[0]
        records[index] = {
            "name": record["name"],
            "founded": int(item["founded_year"]),
            "modernEstablished": None,
            "sourceTitle": "founders.io company-history record",
            "sourceUrl": item.get("wikipedia_url") or item["founders_io_url"],
            "status": "verified",
        }
    records = [
        {
            "name": record["name"],
            **OFFICIAL_OVERRIDES[str(record["name"])],
            "status": "verified",
        }
        if str(record["name"]) in OFFICIAL_OVERRIDES
        else record
        for record in records
    ]
    by_name = {str(record["name"]): record for record in records}
    checked = dt.date.today().isoformat()
    lines = [
        "// Generated by scripts/generate_company_foundings.py.",
        "// Dates come from the maintained S&P 500 reference and founders.io open data.",
        "// Unresolved records are deliberately omitted; the UI reports insufficient information.",
        "",
        "export type CompanyFoundingRecord = {",
        "  founded: number;",
        "  modernEstablished?: number;",
        "  sourceTitle: string;",
        "  sourceUrl: string;",
        "  verifiedAt: string;",
        '  status: "verified";',
        "};",
        "",
        "export const companyFoundings: Record<string, CompanyFoundingRecord> = {",
    ]
    for row in rows:
        name = str(row[1])
        record = by_name[name]
        founded = record.get("founded")
        if not isinstance(founded, int):
            continue
        slug = re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", name.lower()))
        title = str(record["sourceTitle"])
        lines.extend(
            [
                f"  {json.dumps(slug)}: {{",
                f"    founded: {founded},",
                *(
                    [f"    modernEstablished: {record['modernEstablished']},"]
                    if record.get("modernEstablished") and record["modernEstablished"] != founded
                    else []
                ),
                f"    sourceTitle: {json.dumps(title, ensure_ascii=False)},",
                f"    sourceUrl: {json.dumps(str(record['sourceUrl']))},",
                f"    verifiedAt: {json.dumps(checked)},",
                '    status: "verified",',
                "  },",
            ]
        )
    lines.extend(["};", ""])
    TARGET.write_text("\n".join(lines), encoding="utf-8")
    resolved = sum(isinstance(record.get("founded"), int) for record in records)
    unresolved = [str(record["name"]) for record in records if not isinstance(record.get("founded"), int)]
    print(f"resolved {resolved}/500 founding years")
    print("unresolved:", ", ".join(unresolved))


if __name__ == "__main__":
    main()
