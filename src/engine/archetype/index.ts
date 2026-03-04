import { StudentProfile, ArchetypeResult, Archetype, ActivityCategory } from "../core/types";

// Pre-defined base archetypes for clustering
const BASE_ARCHETYPES = [
  {
    id: "deep-tech-builder",
    name: "Deep-Tech Builder",
    coreCategories: ["Engineering/Product", "Research"] as ActivityCategory[],
    winCondition: "Showcasing a deployed, technically complex product with real-world users or high-tier research validation.",
    baseSaturation: 85, // Highly saturated lane
  },
  {
    id: "policy-innovator",
    name: "Policy Innovator",
    coreCategories: ["Policy/Debate", "Community Service"] as ActivityCategory[],
    winCondition: "Influencing measurable local/state legislation or publishing frameworks on emerging issues.",
    baseSaturation: 70,
  },
  {
    id: "quantitative-researcher",
    name: "Quantitative Researcher",
    coreCategories: ["Research", "Engineering/Product"] as ActivityCategory[],
    winCondition: "Tier 1/2 national math/science Olympiads coupled with novel independent research.",
    baseSaturation: 95,
  },
  {
    id: "impact-founder",
    name: "Impact Founder",
    coreCategories: ["Business/Entrepreneurship", "Community Service"] as ActivityCategory[],
    winCondition: "Building a revenue-generating or highly-scaled non-profit that operates independently of the student.",
    baseSaturation: 90,
  },
  {
    id: "creative-provocateur",
    name: "Creative Provocateur",
    coreCategories: ["Arts/Humanities", "Policy/Debate"] as ActivityCategory[],
    winCondition: "National recognition in writing/arts combined with a contrarian, intellectual public portfolio.",
    baseSaturation: 60, // Less saturated for STEM majors
  }
];

export function calculateArchetype(profile: StudentProfile): ArchetypeResult {
  // 1. Calculate Activity Distribution
  const totalHours = profile.activities.reduce((sum, act) => sum + (act.hoursPerWeek * act.weeksPerYear), 0);
  
  const categoryHours = profile.activities.reduce((acc, act) => {
    const hours = act.hoursPerWeek * act.weeksPerYear;
    acc[act.category] = (acc[act.category] || 0) + hours;
    return acc;
  }, {} as Record<ActivityCategory, number>);

  // 2. Score Each Base Archetype
  const scoredArchetypes: Archetype[] = BASE_ARCHETYPES.map(base => {
    // Alignment Score (0-100)
    let alignmentScore = 0;
    let coreHours = 0;
    
    base.coreCategories.forEach(cat => {
      coreHours += categoryHours[cat] || 0;
    });

    const focusRatio = totalHours > 0 ? coreHours / totalHours : 0;
    alignmentScore = Math.min(100, Math.round(focusRatio * 100 * 1.2)); // 1.2 multiplier for focus

    // Viability Score (0-100)
    let viabilityScore = 50; // Base viability
    
    // Adjust based on academics
    if (profile.academics.gpaUnweighted >= 3.9) viabilityScore += 15;
    if (profile.academics.gpaUnweighted < 3.7) viabilityScore -= 20;
    if (profile.academics.courseRigor >= 8) viabilityScore += 10;

    // Adjust based on awards (Tier 1 = massive boost)
    const hasTier1 = profile.awards.some(a => a.tier === "Tier 1");
    const hasTier2 = profile.awards.some(a => a.tier === "Tier 2");
    
    if (hasTier1) viabilityScore += 25;
    else if (hasTier2) viabilityScore += 15;

    // Adjust based on impact level of core activities
    const coreActivities = profile.activities.filter(a => base.coreCategories.includes(a.category));
    const hasNationalImpact = coreActivities.some(a => a.impactLevel === "National" || a.impactLevel === "International");
    if (hasNationalImpact) viabilityScore += 20;

    viabilityScore = Math.min(100, Math.max(0, viabilityScore));

    // Saturation Index (0-100)
    let saturationIndex = base.baseSaturation;
    // CS/Engineering intents increase saturation for tech archetypes
    if (profile.intendedMajor.toLowerCase().includes("computer science") && base.id === "deep-tech-builder") {
      saturationIndex = Math.min(100, saturationIndex + 10);
    }
    // Bay Area / NY increases saturation overall
    if (["CA", "NY", "NJ", "MA"].includes(profile.geography)) {
      saturationIndex = Math.min(100, saturationIndex + 5);
    }

    // Generate Strengths/Weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (hasTier1 || hasTier2) strengths.push("Strong external validation via high-tier awards.");
    if (hasNationalImpact) strengths.push("Demonstrated national-level impact in core focus area.");
    if (profile.academics.gpaUnweighted >= 3.9) strengths.push("Unassailable academic foundation.");

    if (!hasTier1 && !hasTier2 && base.id === "quantitative-researcher") {
      weaknesses.push("Missing required Olympiad/Competition validation for Quant archetype.");
    }
    if (focusRatio < 0.4) {
      weaknesses.push("Activity profile is too scattered. Lacks concentrated 'spike' in core areas.");
    }
    if (profile.academics.courseRigor < 7 && profile.targetTier === "T10") {
      weaknesses.push("Course rigor is below T10 threshold for this archetype.");
    }

    return {
      id: base.id,
      name: base.name,
      alignmentScore,
      saturationIndex,
      viabilityScore,
      keyStrengths: strengths.length > 0 ? strengths : ["No clear distinct strengths identified yet."],
      keyWeaknesses: weaknesses.length > 0 ? weaknesses : ["No glaring vulnerabilities detected."],
      winCondition: base.winCondition
    };
  });

  // 3. Sort and Select
  scoredArchetypes.sort((a, b) => b.alignmentScore - a.alignmentScore);
  
  const primary = scoredArchetypes[0];
  const alternates = [scoredArchetypes[1], scoredArchetypes[2]];

  // 4. Generate Guardrails
  const guardrailFlags: string[] = [];
  
  // Find non-core activities consuming too much time (>20% of total)
  profile.activities.forEach(act => {
    if (!BASE_ARCHETYPES.find(b => b.id === primary.id)?.coreCategories.includes(act.category)) {
      const actRatio = (act.hoursPerWeek * act.weeksPerYear) / totalHours;
      if (actRatio > 0.2) {
        guardrailFlags.push(`Warning: '${act.name}' consumes ${(actRatio*100).toFixed(0)}% of your time but does not align with your primary '${primary.name}' archetype. Consider reducing hours or dropping.`);
      }
    }
  });

  return {
    primary,
    alternates,
    guardrailFlags
  };
}
