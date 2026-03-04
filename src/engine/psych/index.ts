import { StudentProfile } from "../core/types";
import { calculateEV } from "../ev";

export type PsychProfile = {
  burnoutRiskLevel: "Low" | "Moderate" | "Critical";
  burnoutRiskScore: number; // 0-100
  failureRecoveryProtocol: string | null;
  overOptimizationWarning: string | null;
  integrityFlags: string[];
};

export function evaluatePsychology(profile: StudentProfile): PsychProfile {
  const evResult = calculateEV(profile);
  
  // 1. Burnout Risk Calculation
  let burnoutRiskScore = 0;
  const utilizedHours = evResult.totalWeeklyHours;
  const capacity = profile.availableHoursPerWeek;
  
  if (capacity > 0) {
    const utilizationRatio = utilizedHours / capacity;
    burnoutRiskScore = Math.min(100, Math.round(utilizationRatio * 100));
  }

  // Penalize for high course rigor + high EC hours combination
  if (profile.academics.courseRigor >= 8 && utilizedHours > 30) {
    burnoutRiskScore = Math.min(100, burnoutRiskScore + 20);
  }

  let burnoutRiskLevel: PsychProfile["burnoutRiskLevel"] = "Low";
  if (burnoutRiskScore > 90) burnoutRiskLevel = "Critical";
  else if (burnoutRiskScore > 75) burnoutRiskLevel = "Moderate";

  // 2. Over-optimization Guardrail
  // Detects if a student is doing ONLY high EV things without any "authentic" unstructured time
  let overOptimizationWarning: string | null = null;
  const hasLowEVPurePassion = evResult.activities.some(a => a.expectedValue < 5 && a.timeCost > 100);
  if (!hasLowEVPurePassion) {
    overOptimizationWarning = "Your profile appears overly engineered. Admissions committees filter for 'authenticity'. Consider retaining one low-EV but highly personal hobby to avoid looking algorithmic.";
  }

  // 3. Failure Recovery Protocol
  // Triggered if GPA is slipping or target Tier is highly mismatched with current signal
  let failureRecoveryProtocol: string | null = null;
  if (profile.academics.gpaUnweighted < 3.7 && profile.targetTier === "T10") {
    failureRecoveryProtocol = "Academic Filter Risk: Acknowledge the sub-3.7 GPA. Do not invent excuses in the 'Additional Info' section unless there was a verifiable emergency. Pivot strategy to emphasize raw creation/initiative to bypass standard academic screeners.";
  }

  // 4. Integrity Check
  const integrityFlags: string[] = [];
  const hoursPerDay = utilizedHours / 7;
  if (hoursPerDay > 6) {
    // 6 hours of ECs a day + school + sleep is virtually impossible
    integrityFlags.push("Time inflation detected. Reporting " + utilizedHours + " hours/week of extracurriculars alongside a full academic load is mathematically improbable and will trigger a BS-detector from admissions officers.");
  }
  
  const hasFounderRoles = profile.activities.filter(a => a.role.toLowerCase().includes("founder")).length;
  if (hasFounderRoles > 3) {
    integrityFlags.push("Serial Founder Syndrome: Claiming to be the founder of " + hasFounderRoles + " different organizations signals superficial involvement. Consolidate or accurately report roles as 'co-founder' or 'member'.");
  }

  return {
    burnoutRiskLevel,
    burnoutRiskScore,
    failureRecoveryProtocol,
    overOptimizationWarning,
    integrityFlags
  };
}
