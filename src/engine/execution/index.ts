import { StudentProfile } from "../core/types";
import { calculateEV, ActivityEV } from "../ev";

export type WeeklyPriority = {
  id: string;
  title: string;
  source: "EV" | "Roadmap" | "Outreach";
  urgency: "High" | "Medium";
  estimatedHours: number;
};

export type OutreachTarget = {
  id: string;
  targetName: string;
  status: "Drafting" | "Sent" | "Follow-up Required" | "Responded" | "Rejected";
  lastContactDate?: string;
};

export type ExecutionOS = {
  weeklyPriorities: WeeklyPriority[];
  outreachTracker: OutreachTarget[];
  momentumScore: number; // 0-100
  burnoutRisk: boolean;
  focusModeActive: boolean; // True if priorities > 2 and high urgency
};

export function generateExecutionOS(profile: StudentProfile, currentOutreach: OutreachTarget[] = [], historicalMomentum: number = 50): ExecutionOS {
  const evResult = calculateEV(profile);
  
  const priorities: WeeklyPriority[] = [];
  let burnoutRisk = false;

  // 1. Identify highest EV activities that require Double Down
  const doubleDowns = evResult.activities.filter(a => a.recommendation === "Double Down");
  doubleDowns.slice(0, 2).forEach(dd => {
    priorities.push({
      id: `ev-${dd.activityId}`,
      title: `Scale operations for ${dd.activityName}`,
      source: "EV",
      urgency: dd.expectedValue > 15 ? "High" : "Medium",
      estimatedHours: 4
    });
  });

  // 2. Identify Drops (Crucial for freeing up time)
  const drops = evResult.activities.filter(a => a.recommendation === "Drop" && a.isPrestigeTheater);
  if (drops.length > 0) {
    priorities.push({
      id: "drop-1",
      title: `Formally step down from ${drops[0].activityName}`,
      source: "EV",
      urgency: "High",
      estimatedHours: 1
    });
  }

  // 3. Process Outreach Follow-ups
  const followUps = currentOutreach.filter(o => o.status === "Follow-up Required");
  if (followUps.length > 0) {
    priorities.push({
      id: `outreach-${followUps[0].id}`,
      title: `Send follow-up email to ${followUps[0].targetName}`,
      source: "Outreach",
      urgency: "High",
      estimatedHours: 1
    });
  }

  // Fallback if not enough priorities
  if (priorities.length < 3) {
    priorities.push({
      id: "road-1",
      title: "Review Junior Fall Milestones",
      source: "Roadmap",
      urgency: "Medium",
      estimatedHours: 2
    });
  }

  // Burnout Heuristic
  const totalAllocated = priorities.reduce((sum, p) => sum + p.estimatedHours, 0);
  if (evResult.totalWeeklyHours + totalAllocated > profile.availableHoursPerWeek * 1.2) {
    burnoutRisk = true;
  }

  // Momentum Scoring (Mock implementation of weekly consistency)
  let momentumScore = historicalMomentum;
  if (!burnoutRisk && priorities.length >= 3) {
    momentumScore = Math.min(100, momentumScore + 5);
  }

  return {
    weeklyPriorities: priorities.slice(0, 3), // Max 3
    outreachTracker: currentOutreach,
    momentumScore,
    burnoutRisk,
    focusModeActive: burnoutRisk || priorities.some(p => p.urgency === "High")
  };
}
