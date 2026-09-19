import { useRef } from "react";
import { MapSection } from "./sections/map/MapSection";
import { MeteoSection } from "./sections/meteo/MeteoSection";
import { NiveauxSection } from "./sections/niveaux/NiveauxSection";
import { PrelevementSection } from "./sections/prelevement/PrelevementSection";
import { QuizzSection } from "./sections/quizz/page";
import { RechargeSection } from "./sections/recharge/RechargeSection";
import { useDimensions } from "./lib/use-dimensions";

const sectionNames = [
  "recharge",
  "meteo",
  "niveaux",
  "prelevement",
  "quizz",
  "map",
] as const;

type SectionName = (typeof sectionNames)[number];

function isSectionName(value: string | null): value is SectionName {
  return value !== null && sectionNames.includes(value as SectionName);
}

function getSectionName(): SectionName | null {
  const basePath = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const pathname = window.location.pathname.replace(/\/+$/, "");

  // Preferred form for StoryMaps and GitHub Pages:
  // /MEL/map/, /MEL/meteo/, etc.
  if (pathname.startsWith(`${basePath}/`)) {
    const candidate = pathname.slice(basePath.length + 1).split("/")[0];
    if (isSectionName(candidate)) {
      return candidate;
    }
  }

  // Also support hash links, e.g. /MEL/#map.
  const hashCandidate = window.location.hash
    .replace(/^#\/?/, "")
    .split("/")[0];
  if (isSectionName(hashCandidate)) {
    return hashCandidate;
  }

  // Backward compatibility with the former URLs:
  // /MEL/?section=map
  const queryCandidate = new URLSearchParams(window.location.search).get(
    "section",
  );
  return isSectionName(queryCandidate) ? queryCandidate : null;
}

function App() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const name = getSectionName();
  const sectionSize = useDimensions(sectionRef);

  if (!name) {
    const baseUrl = import.meta.env.BASE_URL;

    return (
      <>
        {sectionNames.map((section) => (
          <div key={section}>
            <a href={`${baseUrl}${section}/`}>{section}</a>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="w-full" ref={sectionRef}>
      {name === "recharge" && <RechargeSection width={sectionSize.width} />}
      {name === "meteo" && <MeteoSection width={sectionSize.width} />}
      {name === "niveaux" && <NiveauxSection width={sectionSize.width} />}
      {name === "prelevement" && (
        <PrelevementSection width={sectionSize.width} />
      )}
      {name === "quizz" && <QuizzSection width={sectionSize.width} />}
      {name === "map" && <MapSection />}
    </div>
  );
}

export default App;
