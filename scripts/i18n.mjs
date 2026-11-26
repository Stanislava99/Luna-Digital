/* npm run i18n: lists texts that a language is missing, and translations nothing uses any more. */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const keys = new Set();
const str = /"((?:[^"\\]|\\.)*)"/g;
const add = (raw) => { const s = JSON.parse(`"${raw}"`); if (/[A-Za-z]{2}/.test(s)) keys.add(s); };
const code = [...walk("components"), ...walk("lib"), ...walk("app")].filter((f) => /\.tsx?$/.test(f));
for (const f of code) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/\bt\(\s*"((?:[^"\\]|\\.)*)"/g)) add(m[1]);
  // t(cond ? "a" : "b")
  for (const m of src.matchAll(/\bt\([^()"]* \? "([^"]*)" : "([^"]*)"\)/g)) { add(m[1]); add(m[2]); }
  // Texts kept in data objects and shown with t(item.label)
  if (/planner\/data|home\/Work|home\/Nav|home\/demos|home\/sections/.test(f))
    for (const m of src.matchAll(/\b(?:label|desc|name|story|unit|tag|note|title|text|hint|example|en|q|a): "((?:[^"\\]|\\.)*)"/g)) add(m[1]);
}
// Data lists
const list = (file, re) => { for (const block of readFileSync(file, "utf8").matchAll(re)) for (const m of block[0].matchAll(str)) if (!/^[\d-]+[a-f0-9-]{8,}$/.test(m[1])) add(m[1]); };
const D = "components/planner/data.tsx", V = "components/planner/Preview.tsx", S = "components/home/sections.tsx";
list(D, /(?:stats|amen): \[.*\]/g); list(D, /BASE_AMEN = .*/g);
for (const m of readFileSync(D, "utf8").matchAll(/\["\d+-[a-f0-9]+", "([^"]+)"\]/g)) add(m[1]);
for (const m of readFileSync(D, "utf8").match(/^  en: \{.*\}/m)[0].matchAll(str)) add(m[1]);
list(V, /\["(?:AK|MR|SL)",.*\]/g); list(V, /\[\["(?:🥾|🏖️).*\]\]/g); list(V, /\[\["(?:Best trails|Quiet beaches).*\]\]/g);
list(S, /const (?:items|steps) = \[.*\]/g); list(S, /\[\["Photo gallery".*\]\]/g);
list("components/home/Work.tsx", /FILTERS.*=.*\[\[.*\]\]/g); list("components/home/ContactSection.tsx", /BUDGETS = .*/g);
["Send invoice to Marko", "Call the accountant", "#f3efe6", "all", "web", "app", "software", "AK", "MR", "SL", "Luna Digital"].forEach((k) => keys.delete(k));
keys.add("Home page (incl. amenities & map)");
keys.add("Added the calendar too. It's needed for: {name}");
keys.add("Removed, because it needs the calendar: {name}");
keys.add("Close menu"); keys.add("Open menu");

if (process.argv[2] === "keys") { console.log(JSON.stringify([...keys])); process.exit(); }
let bad = 0;
for (const l of ["sr", "hr", "bs", "me", "el", "es"]) {
  const dict = JSON.parse(readFileSync(`lib/dict/${l}.json`, "utf8"));
  const missing = [...keys].filter((k) => !dict[k]);
  const unused = Object.keys(dict).filter((k) => !keys.has(k));
  const vars = (s) => (s.match(/\{\w+\}|<\/?\w+>/g) ?? []).sort().join();
  const broken = [...keys].filter((k) => dict[k] && vars(k) !== vars(dict[k]));
  bad += missing.length + broken.length;
  console.log(`${l}: ${missing.length} missing, ${unused.length} unused, ${broken.length} broken`);
  [...missing, ...broken].forEach((k) => console.log("   ", k));
  unused.forEach((k) => console.log("    unused:", k));
}
process.exit(bad ? 1 : 0);
