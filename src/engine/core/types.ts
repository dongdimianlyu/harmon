export type PersonalProfile = {
  gradeLevel: number;
  geography: string;
  schoolType: "Public" | "Private" | "Charter" | "Homeschool" | "International";
  financialConstraintLevel: "None" | "Low" | "Moderate" | "High";
};

export type AcademicProfile = {
  gpaUnweighted: number;
  gpaScale: number;
  gpaWeighted: number;
  classRankPercentile?: number;
  courseRigor: number; // 1-10 scale
  satScore?: number;
  actScore?: number;
  apCount?: number;
  apScores?: number[];
};

export type IntendedMajor = {
  primary: string;
  secondary?: string;
  certaintyLevel: number; // 1-5
};

export type ActivityCategory = 
  | "Research" 
  | "Engineering/Product" 
  | "Policy/Debate" 
  | "Business/Entrepreneurship" 
  | "Arts/Humanities" 
  | "Athletics" 
  | "Community Service"
  | "Other";

export type ImpactLevel = 
  | "Local" // School/Town
  | "State" 
  | "National" 
  | "International";

export type Activity = {
  id: string;
  name: string;
  category: ActivityCategory;
  hoursPerWeek: number;
  weeksPerYear: number;
  yearsInvolved: number;
  impactLevel: ImpactLevel;
  role: string; // leadershipLevel mapping
  initiativeLevel: "Participant" | "Leader" | "Founder";
  externalRecognitionLevel?: "None" | "Low" | "Moderate" | "High";
  isPrestigeTheater: boolean; // Computed or manually flagged
};

export type AwardTier = 
  | "Tier 1" // IMO, ISEF, RSI, Telluride
  | "Tier 2" // USAMO Qualifier, National Merit Scholar
  | "Tier 3" // State level winner, AIME qualifier
  | "Tier 4" // Regional/School awards
  | "None";

export type Award = {
  id: string;
  name: string;
  tier: AwardTier;
  category: ActivityCategory;
  selectivityEstimate?: string;
};

export type TargetTier = "T5" | "T10" | "T20" | "T50";

export type StudentProfile = {
  personal: PersonalProfile;
  academics: AcademicProfile;
  intendedMajorInfo: IntendedMajor; // Structured major info
  intendedMajor: string; // legacy flat string for engines
  timeBudget: {
    hoursPerWeekAvailable: number;
  };
  activities: Activity[];
  awards: Award[];
  targetTier: TargetTier;
  availableHoursPerWeek: number; // legacy for engines
  geography: string; // legacy for engines
  essays?: any[];
  recommenders?: any[];
};

// Engine Outputs

export type Archetype = {
  id: string;
  name: string;
  alignmentScore: number; // 0-100
  saturationIndex: number; // 0-100 (higher = more saturated/competitive)
  viabilityScore: number; // 0-100
  keyStrengths: string[];
  keyWeaknesses: string[];
  winCondition: string;
};

export type ArchetypeResult = {
  primary: Archetype;
  alternates: Archetype[];
  guardrailFlags: string[];
};
