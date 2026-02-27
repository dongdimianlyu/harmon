export interface Academics {
  gpa: number;
  courseRigor: "standard" | "honors" | "ap_ib" | "most_demanding";
  satScore: number | null;
  actScore: number | null;
  intendedMajor: string;
}

export type ActivityCategory =
  | "academic"
  | "arts"
  | "athletics"
  | "community_service"
  | "entrepreneurship"
  | "leadership"
  | "research"
  | "stem"
  | "writing"
  | "other";

export type LeadershipLevel =
  | "member"
  | "active_member"
  | "board_member"
  | "vice_president"
  | "president"
  | "founder";

export type ImpactScope =
  | "personal"
  | "club"
  | "school"
  | "local"
  | "regional"
  | "state"
  | "national"
  | "international";

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  yearsActive: number;
  weeklyHours: number;
  leadershipLevel: LeadershipLevel;
  initiativeOwnership: boolean;
  impactScope: ImpactScope;
  measurableOutcomes: string;
}

export type AwardLevel =
  | "school"
  | "regional"
  | "state"
  | "national"
  | "international";

export interface Award {
  id: string;
  title: string;
  level: AwardLevel;
  year: number;
  description: string;
}

export type StrengthRating = 1 | 2 | 3 | 4 | 5;

export interface Recommender {
  id: string;
  name: string;
  subject: string;
  strengthRating: StrengthRating;
  narrativeAlignmentTag: string;
}

export interface StudentProfile {
  firstName: string;
  lastName: string;
  gradeLevel: 9 | 10 | 11 | 12;
  academics: Academics;
  activities: Activity[];
  awards: Award[];
  recommenders: Recommender[];
}

export interface ProfileScores {
  composite: number;
  differentiation: number;
  narrativeCoherence: number;
  trend: "rising" | "stable" | "declining";
}

export interface StrengthTile {
  key: string;
  label: string;
  description: string;
  tier: number | null;
  accent: [string, string];
  explanation: string;
  strategicMove: string;
}

export interface ClusterIdentity {
  label: string;
  saturation: number;
  insight: string;
}

export interface StrategicAlert {
  id: string;
  type: "leadership_gap" | "initiative_gap" | "narrative_misalignment" | "impact_gap" | "academic_gap";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface HighROIMove {
  id: string;
  title: string;
  description: string;
  estimatedImpact: number;
  timeIntensity: "low" | "medium" | "high";
  priority: "essential" | "recommended" | "optional";
}

export interface ProfileGap {
  category: string;
  severity: number;
  suggestedAction: string;
}

export interface WhatIfScenario {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  compositeChange: number;
  differentiationChange: number;
}

export interface NarrativePillar {
  coreThemes: string[];
  primarySpike: string;
  supportingTraits: string[];
  missingTraits: string[];
}

export interface CoherenceLink {
  source: string;
  sourceType: "activity" | "theme" | "recommender";
  target: string;
  targetType: "activity" | "theme" | "recommender";
  strength: number;
}

export interface StoryArc {
  beginning: string;
  turningPoint: string;
  growth: string;
  futureVision: string;
}

export interface GrowthDataPoint {
  grade: 9 | 10 | 11 | 12;
  leadershipLevel: number;
  impactDepth: number;
  initiativeOwnership: number;
  academicRigor: number;
}

export interface RoadmapPhase {
  phase: string;
  gradeLevel: string;
  recommendations: string[];
}
