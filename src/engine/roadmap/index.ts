import { StudentProfile } from "../core/types";
import { calculateArchetype } from "../archetype";

export type RoadmapMilestone = {
  id: string;
  title: string;
  quarter: string; // e.g., "Junior Fall"
  type: "Artifact" | "Validation" | "Leadership" | "Academic" | "Contingency";
  leverageScore: number; // 0-10
  estimatedHours: number;
  description: string;
  status: "todo" | "in-progress" | "completed";
};

export type RoadmapResult = {
  milestones: RoadmapMilestone[];
  thresholdWarning: string | null;
  contingenciesTriggered: string[];
};

export function generateRoadmap(profile: StudentProfile): RoadmapResult {
  const archetypeResult = calculateArchetype(profile);
  const primaryArchetype = archetypeResult.primary;
  
  const milestones: RoadmapMilestone[] = [];
  const contingenciesTriggered: string[] = [];

  // Core Archetype Logic
  if (primaryArchetype.id === "deep-tech-builder") {
    milestones.push({
      id: "dtb-1", title: "Launch MVP of Core Project", quarter: "Junior Fall",
      type: "Artifact", leverageScore: 9.5, estimatedHours: 100, status: "todo",
      description: "Ship a functional version of your primary technical project. Must be accessible publicly."
    });
    milestones.push({
      id: "dtb-2", title: "Acquire First 100 Users", quarter: "Junior Spring",
      type: "Validation", leverageScore: 8.5, estimatedHours: 40, status: "todo",
      description: "Prove traction. Real users are the best defense against 'vaporware' allegations."
    });
  } else if (primaryArchetype.id === "policy-innovator") {
    milestones.push({
      id: "pi-1", title: "Publish Policy Framework", quarter: "Junior Fall",
      type: "Artifact", leverageScore: 9.0, estimatedHours: 80, status: "todo",
      description: "Complete and publish a data-backed policy paper on your core issue."
    });
    milestones.push({
      id: "pi-2", title: "Present to Local Government", quarter: "Junior Spring",
      type: "Validation", leverageScore: 9.5, estimatedHours: 30, status: "todo",
      description: "Secure a meeting or public comment slot with city council or state reps."
    });
  } else {
    // Generic high-tier fallbacks
    milestones.push({
      id: "gen-1", title: "Complete Capstone Portfolio", quarter: "Junior Fall",
      type: "Artifact", leverageScore: 8.0, estimatedHours: 60, status: "todo",
      description: "Consolidate your strongest work into a public-facing portfolio."
    });
  }

  // Contingency Tree Logic
  if (profile.academics.gpaUnweighted < 3.8 && profile.targetTier === "T10") {
    contingenciesTriggered.push("Academic threshold risk for T10.");
    milestones.push({
      id: "cont-gpa", title: "A+ in External College Course", quarter: "Junior Fall",
      type: "Contingency", leverageScore: 9.0, estimatedHours: 120, status: "todo",
      description: "GPA is below target. Must demonstrate extreme rigor via an external university course (e.g., dual enrollment Calc 3)."
    });
  }

  const hasHighTierAward = profile.awards.some(a => a.tier === "Tier 1" || a.tier === "Tier 2");
  if (!hasHighTierAward) {
    contingenciesTriggered.push("Missing national-level validation.");
    milestones.push({
      id: "cont-award", title: "Submit to Tier 2+ Competition", quarter: "Junior Spring",
      type: "Contingency", leverageScore: 8.5, estimatedHours: 50, status: "todo",
      description: "Profile lacks external validation. Identify and prepare for an undersaturated national competition."
    });
  }

  const hasLeadership = profile.activities.some(a => a.role.toLowerCase().includes("founder") || a.role.toLowerCase().includes("president"));
  if (!hasLeadership) {
    contingenciesTriggered.push("No clear leadership narrative.");
    milestones.push({
      id: "cont-lead", title: "Establish Independent Initiative", quarter: "Junior Winter",
      type: "Contingency", leverageScore: 8.0, estimatedHours: 40, status: "todo",
      description: "You lack formal leadership. Start an independent project or chapter related to your primary archetype."
    });
  }

  // Mandatory milestones
  milestones.push({
    id: "mand-1", title: "Secure Key Recommendation Letters", quarter: "Junior Spring",
    type: "Validation", leverageScore: 7.5, estimatedHours: 10, status: "todo",
    description: "Identify and informally ask two core teachers for LORs before summer break."
  });

  milestones.push({
    id: "mand-2", title: "Draft Common App Personal Statement", quarter: "Senior Summer",
    type: "Artifact", leverageScore: 10.0, estimatedHours: 60, status: "todo",
    description: "Complete V1 of the primary narrative essay before senior year begins."
  });

  // Sort by timeline roughly
  const quarterOrder = ["Junior Fall", "Junior Winter", "Junior Spring", "Senior Summer", "Senior Fall"];
  milestones.sort((a, b) => quarterOrder.indexOf(a.quarter) - quarterOrder.indexOf(b.quarter));

  return {
    milestones,
    thresholdWarning: contingenciesTriggered.length > 1 ? "Multiple critical gaps detected. Immediate roadmap adjustment required." : null,
    contingenciesTriggered
  };
}
