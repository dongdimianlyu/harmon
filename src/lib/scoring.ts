import type {
  StudentProfile,
  GrowthDataPoint,
  ProfileScores,
  ProfileGap,
  NarrativePillar,
  CoherenceLink,
  StoryArc,
  HighROIMove,
  StrategicAlert,
  WhatIfScenario,
  StrengthTile,
  ClusterIdentity,
  RoadmapPhase,
} from "@/types/profile";

// ─── Scoring Weights ───────────────────────────────────────────────
const LEADERSHIP_WEIGHTS: Record<string, number> = {
  member: 1,
  active_member: 2,
  board_member: 3,
  vice_president: 4,
  president: 5,
  founder: 6,
};

const IMPACT_WEIGHTS: Record<string, number> = {
  personal: 1,
  club: 2,
  school: 3,
  local: 4,
  regional: 5,
  state: 6,
  national: 8,
  international: 10,
};

const AWARD_WEIGHTS: Record<string, number> = {
  school: 2,
  regional: 4,
  state: 6,
  national: 8,
  international: 10,
};

const RIGOR_WEIGHTS: Record<string, number> = {
  standard: 1,
  honors: 2,
  ap_ib: 3,
  most_demanding: 4,
};

// ─── Profile Scores ────────────────────────────────────────────────
export function calculateProfileScores(profile: StudentProfile): ProfileScores {
  const academicScore = calculateAcademicScore(profile);
  const activityScore = calculateActivityScore(profile);
  const awardScore = calculateAwardScore(profile);
  const narrativeScore = calculateNarrativeCoherence(profile);
  const differentiationScore = calculateDifferentiation(profile);

  const composite = Math.round(
    academicScore * 0.25 +
    activityScore * 0.30 +
    awardScore * 0.15 +
    narrativeScore * 0.15 +
    differentiationScore * 0.15
  );

  const trend = determineTrend(profile);

  return {
    composite: clamp(composite, 0, 100),
    differentiation: clamp(differentiationScore, 0, 100),
    narrativeCoherence: clamp(narrativeScore, 0, 100),
    trend,
  };
}

const percentToTier = (value: number | null): number | null => {
  if (value === null) return null;
  return clamp(Math.round(value / 20), 1, 5);
};

const formatTierLabel = (tier: number | null) => (tier ? `Tier ${tier} of 5` : "Unrated");

const explanationForPillar = (
  key: StrengthTile["key"],
  label: string,
  score: number | null,
  tier: number | null,
  context: Record<string, string | number | boolean> = {}
) => {
  if (key === "athletic" && !context.hasAthletics) {
    return "You haven't logged varsity or club athletics yet, so this pillar remains unrated.";
  }
  if (key === "personality" && context.recommenderCount === 0) {
    return "We need at least one strong recommender or narrative cue before we can score personality.";
  }
  if (score === null) {
    return `We don't have enough verified signals to rate your ${label.toLowerCase()} pillar yet.`;
  }
  const tierLabel = formatTierLabel(tier);
  return `Current ${label.toLowerCase()} indicators total ${Math.round(score)}%, placing you in ${tierLabel}.`;
};

const strategicMoveForPillar = (
  key: StrengthTile["key"],
  tier: number | null,
  context: Record<string, string | number | boolean> = {}
) => {
  const currentTier = tier ?? 0;
  switch (key) {
    case "overall": {
      const weakest = (context.weakestPillar as string) || "academic";
      return currentTier >= 4
        ? "Keep momentum by documenting measurable outcomes and sustaining balance across every pillar."
        : `Focus on lifting your ${weakest} signals; a single strong upgrade there will drag the composite tier upward.`;
    }
    case "academic":
      return currentTier >= 4
        ? "Maintain AP/IB rigor and convert testing into superscore territory to lock in this advantage."
        : "Increase course rigor and push standardized testing above target percentiles to boost academic credibility.";
    case "extracurriculars":
      return currentTier >= 4
        ? "Translate existing leadership into scalable outcomes (press, partnerships, impact metrics)."
        : "Pursue founder/president roles and publish concrete metrics that prove initiative ownership.";
    case "mind":
      return currentTier >= 4
        ? "Keep refining your narrative voice—collect anecdotes and reflections for essays and interviews."
        : "Tighten your story arc: connect activities to a clear theme and capture reflection notes after every milestone.";
    case "athletic":
      return context.hasAthletics
        ? "Document competitive results (PRs, championships) and pursue captaincy to unlock a higher athletic tier."
        : "If athletics matter, add at least one season of varsity or club participation to give adcoms a durability signal.";
    case "personality":
      return context.recommenderCount && Number(context.recommenderCount) >= 2
        ? "Coach recommenders on specific stories that highlight voice, collaboration, and resilience."
        : "Secure 2-3 recommenders who can speak to your intellectual curiosity and character beyond the resume.";
    default:
      return "Identify a concrete action that increases proof points for this pillar over the next 4-6 weeks.";
  }
};

export function generateStrengthTiles(profile: StudentProfile): StrengthTile[] {
  const academicScore = clamp(calculateAcademicScore(profile), 0, 100);
  const activityScore = clamp(calculateActivityScore(profile), 0, 100);
  const narrativeScore = clamp(calculateNarrativeCoherence(profile), 0, 100);
  const differentiationScore = clamp(calculateDifferentiation(profile), 0, 100);
  const compositeScore = calculateProfileScores(profile).composite;

  const athleticActivities = profile.activities.filter((a) => a.category === "athletics");
  const athleticHours = athleticActivities.reduce((sum, act) => sum + act.weeklyHours, 0);
  const athleticScore = athleticActivities.length
    ? clamp((athleticHours / (athleticActivities.length * 12)) * 100, 0, 100)
    : 0;

  const personalityScore = profile.recommenders.length
    ? clamp(profile.recommenders.length * 25 + (narrativeScore / 4), 0, 100)
    : null;

  const subPillars: { key: StrengthTile["key"]; tier: number | null }[] = [
    { key: "academic", tier: percentToTier(academicScore) },
    { key: "extracurriculars", tier: percentToTier(activityScore) },
    { key: "mind", tier: percentToTier(narrativeScore) },
    { key: "athletic", tier: athleticActivities.length ? percentToTier(athleticScore) : null },
    { key: "personality", tier: percentToTier(personalityScore) },
  ];

  const weakestPillar = subPillars.reduce((lowest, current) => {
    const currentTier = current.tier ?? 0;
    if (!lowest) return current;
    const lowestTier = lowest.tier ?? 0;
    return currentTier < lowestTier ? current : lowest;
  }, subPillars[0]);

  const tiles: StrengthTile[] = [
    {
      key: "overall",
      label: "Overall",
      description: "Composite readiness signal",
      tier: percentToTier(compositeScore),
      accent: ["#facc15", "#f97316"],
      explanation: explanationForPillar("overall", "overall", compositeScore, percentToTier(compositeScore), {
        weakestPillar: weakestPillar?.key,
      }),
      strategicMove: strategicMoveForPillar("overall", percentToTier(compositeScore), {
        weakestPillar: weakestPillar?.key,
      }),
    },
    {
      key: "academic",
      label: "Academic",
      description: "Rigor + testing momentum",
      tier: percentToTier(academicScore),
      accent: ["#22d3ee", "#14b8a6"],
      explanation: explanationForPillar("academic", "academic", academicScore, percentToTier(academicScore)),
      strategicMove: strategicMoveForPillar("academic", percentToTier(academicScore)),
    },
    {
      key: "extracurriculars",
      label: "Extracurriculars",
      description: "Leadership & initiative",
      tier: percentToTier(activityScore),
      accent: ["#34d399", "#22c55e"],
      explanation: explanationForPillar(
        "extracurriculars",
        "extracurricular",
        activityScore,
        percentToTier(activityScore)
      ),
      strategicMove: strategicMoveForPillar("extracurriculars", percentToTier(activityScore)),
    },
    {
      key: "mind",
      label: "Mind",
      description: "Narrative coherence",
      tier: percentToTier(narrativeScore),
      accent: ["#fb923c", "#f97316"],
      explanation: explanationForPillar("mind", "narrative", narrativeScore, percentToTier(narrativeScore)),
      strategicMove: strategicMoveForPillar("mind", percentToTier(narrativeScore)),
    },
    {
      key: "athletic",
      label: "Athletic",
      description: athleticActivities.length ? "Athletic impact signal" : "No varsity data",
      tier: athleticActivities.length ? percentToTier(athleticScore) : null,
      accent: ["#fda4af", "#fb7185"],
      explanation: explanationForPillar("athletic", "athletic", athleticActivities.length ? athleticScore : null, athleticActivities.length ? percentToTier(athleticScore) : null, {
        hasAthletics: athleticActivities.length > 0,
      }),
      strategicMove: strategicMoveForPillar("athletic", athleticActivities.length ? percentToTier(athleticScore) : null, {
        hasAthletics: athleticActivities.length > 0,
      }),
    },
    {
      key: "personality",
      label: "Personality",
      description: personalityScore === null ? "Need narrative evidence" : "Recs & voice strength",
      tier: percentToTier(personalityScore),
      accent: ["#d1d5db", "#f3f4f6"],
      explanation: explanationForPillar(
        "personality",
        "personality",
        personalityScore,
        percentToTier(personalityScore),
        { recommenderCount: profile.recommenders.length }
      ),
      strategicMove: strategicMoveForPillar("personality", percentToTier(personalityScore), {
        recommenderCount: profile.recommenders.length,
      }),
    },
  ];

  return tiles;
}

function calculateAcademicScore(profile: StudentProfile): number {
  const { gpa, courseRigor, satScore, actScore } = profile.academics;
  const gpaScore = (gpa / 4.0) * 60;
  const rigorScore = (RIGOR_WEIGHTS[courseRigor] || 1) * 10;
  let testScore = 0;
  if (satScore) testScore = Math.max(testScore, (satScore / 1600) * 100);
  if (actScore) testScore = Math.max(testScore, (actScore / 36) * 100);
  if (!satScore && !actScore) testScore = 50;
  return gpaScore + rigorScore + testScore * 0.3;
}

function calculateActivityScore(profile: StudentProfile): number {
  if (profile.activities.length === 0) return 15;
  let total = 0;
  for (const act of profile.activities) {
    const leadership = LEADERSHIP_WEIGHTS[act.leadershipLevel] || 1;
    const impact = IMPACT_WEIGHTS[act.impactScope] || 1;
    const initiative = act.initiativeOwnership ? 1.5 : 1;
    const depth = Math.min(act.yearsActive / 4, 1) * 2;
    const hours = Math.min(act.weeklyHours / 20, 1) * 1.5;
    total += (leadership + impact + depth + hours) * initiative;
  }
  const avg = total / profile.activities.length;
  const breadth = Math.min(profile.activities.length / 6, 1) * 20;
  return Math.min(avg * 8 + breadth, 100);
}

function calculateAwardScore(profile: StudentProfile): number {
  if (profile.awards.length === 0) return 10;
  let total = 0;
  for (const award of profile.awards) {
    total += AWARD_WEIGHTS[award.level] || 2;
  }
  return Math.min(total * 5, 100);
}

function calculateNarrativeCoherence(profile: StudentProfile): number {
  if (profile.activities.length === 0) return 20;
  const categories = new Set(profile.activities.map((a) => a.category));
  const uniqueCategories = categories.size;
  const totalActivities = profile.activities.length;

  const focusRatio = totalActivities > 0 ? (totalActivities - uniqueCategories + 1) / totalActivities : 0;
  const hasAlignedRecommenders = profile.recommenders.filter(
    (r) => r.narrativeAlignmentTag && r.narrativeAlignmentTag.length > 0
  ).length;
  const recommenderBonus = Math.min(hasAlignedRecommenders * 10, 20);

  const majorAlignment = profile.activities.some(
    (a) =>
      a.category === "academic" ||
      a.category === "research" ||
      a.category === "stem"
  )
    ? 15
    : 0;

  return Math.min(focusRatio * 60 + recommenderBonus + majorAlignment, 100);
}

function calculateDifferentiation(profile: StudentProfile): number {
  let score = 20;
  const hasFounder = profile.activities.some((a) => a.leadershipLevel === "founder");
  if (hasFounder) score += 20;

  const hasNationalAward = profile.awards.some(
    (a) => a.level === "national" || a.level === "international"
  );
  if (hasNationalAward) score += 15;

  const hasHighImpact = profile.activities.some(
    (a) => a.impactScope === "national" || a.impactScope === "international"
  );
  if (hasHighImpact) score += 15;

  const hasInitiative = profile.activities.filter((a) => a.initiativeOwnership).length;
  score += Math.min(hasInitiative * 8, 24);

  const hasResearch = profile.activities.some((a) => a.category === "research");
  if (hasResearch) score += 10;

  return clamp(score, 0, 100);
}

function determineTrend(profile: StudentProfile): "rising" | "stable" | "declining" {
  const hasLeadership = profile.activities.some(
    (a) =>
      a.leadershipLevel === "president" ||
      a.leadershipLevel === "founder" ||
      a.leadershipLevel === "vice_president"
  );
  const hasMultiYear = profile.activities.filter((a) => a.yearsActive >= 2).length;
  if (hasLeadership && hasMultiYear >= 2) return "rising";
  if (profile.activities.length < 2) return "declining";
  return "stable";
}

// ─── Cluster Identity ──────────────────────────────────────────────
export function determineCluster(profile: StudentProfile): ClusterIdentity {
  const categories = profile.activities.map((a) => a.category);
  const freq: Record<string, number> = {};
  for (const c of categories) freq[c] = (freq[c] || 0) + 1;

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0]?.[0] || "undeclared";
  const secondary = sorted[1]?.[0];

  const clusterMap: Record<string, string> = {
    stem: "STEM Innovator",
    research: "Research Scholar",
    arts: "Creative Visionary",
    athletics: "Scholar-Athlete",
    leadership: "Institutional Leader",
    community_service: "Social Impact Driver",
    entrepreneurship: "Entrepreneurial Builder",
    academic: "Academic Specialist",
    writing: "Literary Intellectual",
    other: "Multidisciplinary Explorer",
  };

  const label = clusterMap[primary] || "Emerging Profile";
  const hasInitiative = profile.activities.some((a) => a.initiativeOwnership);
  const hasHighLeadership = profile.activities.some(
    (a) => a.leadershipLevel === "president" || a.leadershipLevel === "founder"
  );

  const saturation = primary === "stem" ? 78 : primary === "research" ? 65 : primary === "arts" ? 42 : 55;

  let insight = `Your profile clusters primarily as a ${label}`;
  if (secondary) {
    insight += ` with secondary strength in ${clusterMap[secondary] || secondary}`;
  }
  insight += ". ";
  if (saturation > 70) {
    insight += `This is a highly competitive cluster with ${saturation}% saturation among top applicants. Differentiation through initiative ownership and measurable impact will be critical.`;
  } else if (saturation > 50) {
    insight += `This cluster has moderate competition. Strengthening your narrative coherence and deepening leadership roles will help you stand out.`;
  } else {
    insight += `This is a less saturated cluster, giving you a natural differentiation advantage. Focus on depth and demonstrable outcomes to maximize your positioning.`;
  }

  if (hasInitiative && hasHighLeadership) {
    insight += " Your initiative ownership and leadership progression are strong differentiators.";
  }

  return { label, saturation, insight };
}

// ─── Strategic Alerts ──────────────────────────────────────────────
export function generateAlerts(profile: StudentProfile): StrategicAlert[] {
  const alerts: StrategicAlert[] = [];

  const maxLeadership = Math.max(
    ...profile.activities.map((a) => LEADERSHIP_WEIGHTS[a.leadershipLevel] || 0),
    0
  );
  if (maxLeadership < 4) {
    alerts.push({
      id: "leadership-gap",
      type: "leadership_gap",
      title: "Leadership Progression Gap",
      description:
        "No activities show president-level or founder-level leadership. Top-tier applicants typically demonstrate clear leadership escalation in at least one domain.",
      severity: maxLeadership < 2 ? "critical" : "high",
    });
  }

  const initiativeCount = profile.activities.filter((a) => a.initiativeOwnership).length;
  if (initiativeCount === 0) {
    alerts.push({
      id: "initiative-gap",
      type: "initiative_gap",
      title: "Initiative Ownership Gap",
      description:
        "None of your activities demonstrate initiative ownership. Admissions officers look for evidence that you create opportunities, not just participate in them.",
      severity: "critical",
    });
  } else if (initiativeCount < 2) {
    alerts.push({
      id: "initiative-low",
      type: "initiative_gap",
      title: "Limited Initiative Ownership",
      description:
        "Only one activity shows initiative ownership. Consider expanding self-started projects or taking ownership of new programs within existing organizations.",
      severity: "medium",
    });
  }

  const narrativeScore = calculateNarrativeCoherence(profile);
  if (narrativeScore < 45) {
    alerts.push({
      id: "narrative-misalignment",
      type: "narrative_misalignment",
      title: "Narrative Misalignment Detected",
      description:
        "Your activities span too many unrelated categories without a clear connecting thread. This makes it harder for admissions officers to identify your core identity.",
      severity: narrativeScore < 30 ? "high" : "medium",
    });
  }

  const maxImpact = Math.max(
    ...profile.activities.map((a) => IMPACT_WEIGHTS[a.impactScope] || 0),
    0
  );
  if (maxImpact < 4) {
    alerts.push({
      id: "impact-gap",
      type: "impact_gap",
      title: "Impact Scope Limited",
      description:
        "Your activities are primarily school-level or below. Expanding impact to local, regional, or national scope significantly strengthens your profile.",
      severity: "high",
    });
  }

  if (profile.academics.gpa < 3.5 || profile.academics.courseRigor === "standard") {
    alerts.push({
      id: "academic-gap",
      type: "academic_gap",
      title: "Academic Foundation Needs Strengthening",
      description:
        "Your academic metrics may not meet the baseline expectations for highly selective institutions. Consider increasing course rigor or addressing GPA trajectory.",
      severity: profile.academics.gpa < 3.0 ? "critical" : "medium",
    });
  }

  return alerts.slice(0, 3);
}

// ─── High-ROI Moves ────────────────────────────────────────────────
export function generateHighROIMoves(profile: StudentProfile): HighROIMove[] {
  const moves: HighROIMove[] = [];

  const hasResearch = profile.activities.some((a) => a.category === "research");
  if (!hasResearch) {
    moves.push({
      id: "add-research",
      title: "Launch an Independent Research Project",
      description:
        "Start a research project aligned with your intended major. Even a small-scale study demonstrates intellectual curiosity and academic depth beyond coursework.",
      estimatedImpact: 12,
      timeIntensity: "high",
      priority: "essential",
    });
  }

  const hasFounder = profile.activities.some((a) => a.leadershipLevel === "founder");
  if (!hasFounder) {
    moves.push({
      id: "found-initiative",
      title: "Found a Community Initiative",
      description:
        "Create an organization, program, or project that addresses a real problem. Founder-level activities are among the strongest differentiators in admissions.",
      estimatedImpact: 15,
      timeIntensity: "high",
      priority: "essential",
    });
  }

  const lowImpactActivities = profile.activities.filter(
    (a) => IMPACT_WEIGHTS[a.impactScope] <= 2 && a.yearsActive < 2
  );
  if (lowImpactActivities.length > 0) {
    moves.push({
      id: "consolidate-activities",
      title: "Consolidate Low-Impact Activities",
      description:
        `Consider reducing time in ${lowImpactActivities.length} low-impact activities and redirecting effort toward your strongest commitments. Depth beats breadth.`,
      estimatedImpact: 8,
      timeIntensity: "low",
      priority: "recommended",
    });
  }

  const maxLeadership = Math.max(
    ...profile.activities.map((a) => LEADERSHIP_WEIGHTS[a.leadershipLevel] || 0),
    0
  );
  if (maxLeadership < 5) {
    moves.push({
      id: "escalate-leadership",
      title: "Pursue a Leadership Promotion",
      description:
        "Actively seek president or executive-level roles in your strongest organizations. Leadership escalation over time is a key signal admissions officers track.",
      estimatedImpact: 10,
      timeIntensity: "medium",
      priority: "recommended",
    });
  }

  const hasNationalAward = profile.awards.some(
    (a) => a.level === "national" || a.level === "international"
  );
  if (!hasNationalAward) {
    moves.push({
      id: "pursue-national-recognition",
      title: "Compete for National-Level Recognition",
      description:
        "Identify and enter competitions at the national or international level in your primary domain. Even semifinalist status provides significant differentiation.",
      estimatedImpact: 14,
      timeIntensity: "medium",
      priority: "essential",
    });
  }

  moves.push({
    id: "strengthen-recommenders",
    title: "Deepen Recommender Relationships",
    description:
      "Invest in meaningful interactions with potential recommenders who can speak to your intellectual character and growth trajectory. Quality of recommendation letters is often underestimated.",
    estimatedImpact: 6,
    timeIntensity: "low",
    priority: "recommended",
  });

  return moves.sort((a, b) => b.estimatedImpact - a.estimatedImpact).slice(0, 5);
}

// ─── Profile Gaps ──────────────────────────────────────────────────
export function analyzeProfileGaps(profile: StudentProfile): ProfileGap[] {
  const gaps: ProfileGap[] = [];

  const rigorScore = RIGOR_WEIGHTS[profile.academics.courseRigor] || 1;
  if (rigorScore < 3) {
    gaps.push({
      category: "Academic Depth",
      severity: rigorScore === 1 ? 85 : 55,
      suggestedAction:
        "Increase course rigor by enrolling in AP/IB courses aligned with your intended major. Academic depth in your area of interest is a baseline expectation.",
    });
  }

  const maxLeadership = Math.max(
    ...profile.activities.map((a) => LEADERSHIP_WEIGHTS[a.leadershipLevel] || 0),
    0
  );
  if (maxLeadership < 5) {
    gaps.push({
      category: "Leadership",
      severity: maxLeadership < 3 ? 80 : 45,
      suggestedAction:
        "Seek executive-level positions in your primary organizations. Demonstrate leadership through measurable outcomes, not just titles.",
    });
  }

  const initiativeCount = profile.activities.filter((a) => a.initiativeOwnership).length;
  if (initiativeCount < 2) {
    gaps.push({
      category: "Initiative Ownership",
      severity: initiativeCount === 0 ? 90 : 50,
      suggestedAction:
        "Start or take ownership of projects that demonstrate self-direction. This is one of the strongest signals of future potential.",
    });
  }

  const maxImpact = Math.max(
    ...profile.activities.map((a) => IMPACT_WEIGHTS[a.impactScope] || 0),
    0
  );
  if (maxImpact < 6) {
    gaps.push({
      category: "Impact Scope",
      severity: maxImpact < 3 ? 75 : 40,
      suggestedAction:
        "Expand the reach of your strongest activities. Scaling impact from school-level to regional or national scope dramatically changes how your profile reads.",
    });
  }

  return gaps.sort((a, b) => b.severity - a.severity);
}

// ─── What-If Scenarios ─────────────────────────────────────────────
export function generateWhatIfScenarios(profile: StudentProfile): WhatIfScenario[] {
  return [
    {
      id: "add-leadership",
      label: "Add President-Level Leadership",
      description: "Simulate gaining a president or executive role in your primary activity",
      enabled: false,
      compositeChange: 8,
      differentiationChange: 12,
    },
    {
      id: "add-research",
      label: "Add Research Experience",
      description: "Simulate starting an independent or mentored research project",
      enabled: false,
      compositeChange: 7,
      differentiationChange: 10,
    },
    {
      id: "add-national-award",
      label: "Win National-Level Award",
      description: "Simulate receiving recognition at the national or international level",
      enabled: false,
      compositeChange: 10,
      differentiationChange: 15,
    },
    {
      id: "drop-low-impact",
      label: "Drop Low-Impact Activity",
      description: "Simulate removing your weakest activity and reallocating time",
      enabled: false,
      compositeChange: 3,
      differentiationChange: 5,
    },
  ];
}

// ─── Narrative Analysis ────────────────────────────────────────────
export function analyzeNarrative(profile: StudentProfile): NarrativePillar {
  const categoryThemes: Record<string, string> = {
    stem: "Scientific Innovation",
    research: "Intellectual Curiosity",
    arts: "Creative Expression",
    athletics: "Discipline & Resilience",
    leadership: "Institutional Impact",
    community_service: "Social Responsibility",
    entrepreneurship: "Entrepreneurial Drive",
    academic: "Academic Excellence",
    writing: "Narrative Voice",
    other: "Interdisciplinary Thinking",
  };

  const categories = profile.activities.map((a) => a.category);
  const freq: Record<string, number> = {};
  for (const c of categories) freq[c] = (freq[c] || 0) + 1;
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

  const coreThemes = sorted.slice(0, 3).map(([cat]) => categoryThemes[cat] || cat);
  const primarySpike = coreThemes[0] || "Undetermined";
  const supportingTraits: string[] = [];
  const missingTraits: string[] = [];

  const hasLeadership = profile.activities.some(
    (a) => a.leadershipLevel === "president" || a.leadershipLevel === "founder"
  );
  const hasInitiative = profile.activities.some((a) => a.initiativeOwnership);
  const hasImpact = profile.activities.some(
    (a) => a.impactScope === "national" || a.impactScope === "international"
  );
  const hasService = profile.activities.some((a) => a.category === "community_service");

  if (hasLeadership) supportingTraits.push("Leadership Progression");
  else missingTraits.push("Leadership Progression");

  if (hasInitiative) supportingTraits.push("Self-Direction");
  else missingTraits.push("Self-Direction");

  if (hasImpact) supportingTraits.push("Scalable Impact");
  else missingTraits.push("Scalable Impact");

  if (hasService) supportingTraits.push("Community Orientation");
  else missingTraits.push("Community Orientation");

  if (profile.recommenders.length >= 2) supportingTraits.push("Strong Advocacy Network");
  else missingTraits.push("Strong Advocacy Network");

  return { coreThemes, primarySpike, supportingTraits, missingTraits };
}

// ─── Coherence Links ───────────────────────────────────────────────
export function generateCoherenceLinks(profile: StudentProfile): CoherenceLink[] {
  const links: CoherenceLink[] = [];
  const narrative = analyzeNarrative(profile);

  for (const activity of profile.activities) {
    const categoryTheme: Record<string, string> = {
      stem: "Scientific Innovation",
      research: "Intellectual Curiosity",
      arts: "Creative Expression",
      leadership: "Institutional Impact",
      community_service: "Social Responsibility",
      entrepreneurship: "Entrepreneurial Drive",
    };
    const theme = categoryTheme[activity.category];
    if (theme && narrative.coreThemes.includes(theme)) {
      links.push({
        source: activity.title,
        sourceType: "activity",
        target: theme,
        targetType: "theme",
        strength: 0.8,
      });
    }
  }

  for (const rec of profile.recommenders) {
    if (rec.narrativeAlignmentTag) {
      const matchingTheme = narrative.coreThemes.find(
        (t) => t.toLowerCase().includes(rec.narrativeAlignmentTag.toLowerCase()) ||
               rec.narrativeAlignmentTag.toLowerCase().includes(t.toLowerCase().split(" ")[0])
      );
      if (matchingTheme) {
        links.push({
          source: rec.name,
          sourceType: "recommender",
          target: matchingTheme,
          targetType: "theme",
          strength: 0.9,
        });
      } else {
        links.push({
          source: rec.name,
          sourceType: "recommender",
          target: rec.narrativeAlignmentTag,
          targetType: "theme",
          strength: 0.4,
        });
      }
    }
  }

  return links;
}

// ─── Cliché Detection ──────────────────────────────────────────────
export function detectCliches(text: string): string[] {
  const cliches = [
    "changed my life",
    "passionate about",
    "since I was young",
    "make a difference",
    "think outside the box",
    "pushed me out of my comfort zone",
    "opened my eyes",
    "gave me a new perspective",
    "taught me the value of",
    "I realized that",
    "ever since I can remember",
    "in today's society",
    "the world we live in",
    "my journey",
    "sparked my interest",
    "fueled my passion",
    "I've always been",
    "a defining moment",
    "shaped who I am",
    "broadened my horizons",
  ];

  const lower = text.toLowerCase();
  return cliches.filter((c) => lower.includes(c));
}

// ─── Story Arc ─────────────────────────────────────────────────────
export function generateStoryArc(profile: StudentProfile): StoryArc {
  const narrative = analyzeNarrative(profile);
  const cluster = determineCluster(profile);

  const beginning = profile.activities.length > 0
    ? `Early exposure to ${narrative.primarySpike.toLowerCase()} through ${profile.activities[0]?.title || "initial experiences"}, establishing foundational interest and curiosity.`
    : "An emerging interest that has yet to find its primary expression through structured activities.";

  const turningPoint = profile.activities.some((a) => a.initiativeOwnership)
    ? `The transition from participant to creator — taking ownership and launching independent initiatives that demonstrated genuine commitment beyond resume-building.`
    : `A critical inflection point is needed: moving from participation to ownership. The strongest narratives show a moment where you stopped following and started leading.`;

  const growth = profile.activities.some(
    (a) => a.leadershipLevel === "president" || a.leadershipLevel === "founder"
  )
    ? `Progressive deepening of expertise and leadership within the ${cluster.label.toLowerCase()} domain, with measurable outcomes that validate your trajectory.`
    : `Growth should demonstrate escalating responsibility and impact. Focus on showing how your understanding and capabilities have compounded over time.`;

  const futureVision = profile.academics.intendedMajor
    ? `Leveraging your ${cluster.label.toLowerCase()} identity to pursue ${profile.academics.intendedMajor} at the collegiate level, with a clear vision for how your unique combination of experiences will contribute to campus and beyond.`
    : `Articulating a forward-looking vision that connects your accumulated experiences to a specific academic and professional trajectory.`;

  return { beginning, turningPoint, growth, futureVision };
}

// ─── Growth Tracking ───────────────────────────────────────────────
export function generateGrowthData(profile: StudentProfile): GrowthDataPoint[] {
  const currentGrade = profile.gradeLevel;
  const data: GrowthDataPoint[] = [];

  for (let grade = 9; grade <= 12; grade++) {
    const g = grade as 9 | 10 | 11 | 12;
    if (grade <= currentGrade) {
      const progress = (grade - 8) / (currentGrade - 8 || 1);
      const maxLeadership = Math.max(
        ...profile.activities.map((a) => LEADERSHIP_WEIGHTS[a.leadershipLevel] || 0),
        0
      );
      const maxImpact = Math.max(
        ...profile.activities.map((a) => IMPACT_WEIGHTS[a.impactScope] || 0),
        0
      );
      const initiativeRatio =
        profile.activities.length > 0
          ? profile.activities.filter((a) => a.initiativeOwnership).length / profile.activities.length
          : 0;

      data.push({
        grade: g,
        leadershipLevel: Math.round(((maxLeadership / 6) * 100 * progress) * 10) / 10,
        impactDepth: Math.round(((maxImpact / 10) * 100 * progress) * 10) / 10,
        initiativeOwnership: Math.round((initiativeRatio * 100 * progress) * 10) / 10,
        academicRigor: Math.round(((RIGOR_WEIGHTS[profile.academics.courseRigor] || 1) / 4 * 100 * progress) * 10) / 10,
      });
    } else {
      const lastData = data[data.length - 1];
      data.push({
        grade: g,
        leadershipLevel: Math.round((lastData?.leadershipLevel || 0) * 1.15 * 10) / 10,
        impactDepth: Math.round((lastData?.impactDepth || 0) * 1.12 * 10) / 10,
        initiativeOwnership: Math.round((lastData?.initiativeOwnership || 0) * 1.1 * 10) / 10,
        academicRigor: Math.round((lastData?.academicRigor || 0) * 1.08 * 10) / 10,
      });
    }
  }

  return data;
}

// ─── Plateau Detection ─────────────────────────────────────────────
export function detectPlateaus(growthData: GrowthDataPoint[]): string[] {
  const plateaus: string[] = [];
  if (growthData.length < 2) return plateaus;

  const metrics: (keyof Omit<GrowthDataPoint, "grade">)[] = [
    "leadershipLevel",
    "impactDepth",
    "initiativeOwnership",
    "academicRigor",
  ];

  const labels: Record<string, string> = {
    leadershipLevel: "Leadership Level",
    impactDepth: "Impact Depth",
    initiativeOwnership: "Initiative Ownership",
    academicRigor: "Academic Rigor",
  };

  for (const metric of metrics) {
    const last = growthData[growthData.length - 1];
    const prev = growthData[growthData.length - 2];
    if (last && prev) {
      const change = last[metric] - prev[metric];
      if (change < 5 && last[metric] < 70) {
        plateaus.push(labels[metric]);
      }
    }
  }

  return plateaus;
}

// ─── Roadmap Generator ─────────────────────────────────────────────
export function generateRoadmap(profile: StudentProfile): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phase: "Exploration & Foundation",
    gradeLevel: "Sophomore Year",
    recommendations: [
      "Explore 4-6 activities across 2-3 interest areas to identify your primary spike",
      "Begin building relationships with teachers who can become strong recommenders",
      "Take at least 2 honors or AP courses aligned with your intended major",
      "Start a journal documenting meaningful experiences and reflections for future essays",
      "Attend summer programs or workshops in your area of emerging interest",
    ],
  });

  phases.push({
    phase: "Deepening & Leadership",
    gradeLevel: "Junior Year",
    recommendations: [
      "Narrow to 3-4 core activities and pursue leadership positions in each",
      "Launch at least one self-directed initiative or project",
      "Compete in regional or national competitions in your primary domain",
      "Begin independent research or a significant creative project",
      "Cultivate 2-3 recommender relationships with specific narrative alignment",
      "Take the most demanding course load available in your areas of strength",
    ],
  });

  phases.push({
    phase: "Consolidation & Narrative",
    gradeLevel: "Senior Year",
    recommendations: [
      "Achieve measurable outcomes in your top 2-3 activities",
      "Finalize your narrative arc connecting activities, academics, and future vision",
      "Secure recommendation letters that reinforce your core identity",
      "Complete essays that demonstrate self-awareness and intellectual depth",
      "Ensure your application tells a coherent story, not a list of achievements",
      "Focus on quality of impact over quantity of activities",
    ],
  });

  return phases;
}

// ─── Utility ───────────────────────────────────────────────────────
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
