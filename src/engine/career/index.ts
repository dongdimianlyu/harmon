import { StudentProfile } from "../core/types";
import { calculateArchetype } from "../archetype";

export type CareerPathway = {
  industry: string;
  freshmanInternshipTarget: string;
  portfolioGaps: string[];
  resumeSignalScore: number; // 0-100
  coldEmailStrategy: string;
};

export function generateCareerPathway(profile: StudentProfile): CareerPathway {
  const archetypeResult = calculateArchetype(profile);
  const primaryArchetype = archetypeResult.primary;

  let industry = "General Consulting / Tech";
  let freshmanInternshipTarget = "Series A/B Startup Intern";
  const portfolioGaps: string[] = [];
  let coldEmailStrategy = "Target alumni at mid-size firms. Emphasize ability to learn quickly and hustle.";

  // Resume Signal Scoring (Heuristic based on hard skills and validation)
  let resumeSignalScore = 40; // Base baseline
  const hasTechProject = profile.activities.some(a => a.category === "Engineering/Product");
  const hasQuantValidation = profile.awards.some(a => ["Tier 1", "Tier 2", "Tier 3"].includes(a.tier));
  
  if (hasTechProject) resumeSignalScore += 20;
  if (hasQuantValidation) resumeSignalScore += 20;
  if (profile.activities.some(a => a.role.toLowerCase().includes("founder"))) resumeSignalScore += 10;

  resumeSignalScore = Math.min(100, resumeSignalScore);

  if (primaryArchetype.id === "deep-tech-builder") {
    industry = "Big Tech / Quant / AI Startups";
    freshmanInternshipTarget = "SWE Intern at Seed/Series A AI Startup";
    if (!hasTechProject) portfolioGaps.push("Missing a deployed full-stack or ML application.");
    coldEmailStrategy = "Target technical founders directly via Twitter/Email. Send GitHub repo link and a Loom demo of your project. Ignore HR.";
  } else if (primaryArchetype.id === "quantitative-researcher") {
    industry = "Quant Finance / PhD / Biotech";
    freshmanInternshipTarget = "Research Assistant at Target Uni / Quant Trading Prop Shop (Explore)";
    if (!hasQuantValidation) portfolioGaps.push("Lacking verifiable math/stats Olympiad scores or published paper.");
    coldEmailStrategy = "Cold email PI's at target university labs. Read their recent paper, propose a specific data cleaning or analysis task you can do for free.";
  } else if (primaryArchetype.id === "policy-innovator") {
    industry = "Public Sector / Think Tanks / MBB Consulting";
    freshmanInternshipTarget = "Research Fellow at Regional Think Tank or Local Government";
    portfolioGaps.push("Ensure you have a published writing sample (Substack/Blog) analyzing a current policy issue.");
    coldEmailStrategy = "Target mid-level researchers at think tanks. Offer to do data scraping or literature reviews for their upcoming publications.";
  } else if (primaryArchetype.id === "impact-founder") {
    industry = "Venture Capital / Product Management / Entrepreneurship";
    freshmanInternshipTarget = "Venture Scout / Product Intern at Series A Startup";
    if (resumeSignalScore < 60) portfolioGaps.push("Need verifiable metrics (Users, MRR, or Funds Raised) from your high school initiative.");
    coldEmailStrategy = "Target VC Associates or Startup Founders. Pitch a 'market map' or 'competitor analysis' you built for their specific vertical.";
  }

  return {
    industry,
    freshmanInternshipTarget,
    portfolioGaps,
    resumeSignalScore,
    coldEmailStrategy
  };
}
