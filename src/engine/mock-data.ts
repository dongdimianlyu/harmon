import { StudentProfile } from "./core/types";

export const mockProfile: StudentProfile = {
  personal: {
    gradeLevel: 11,
    geography: "NY",
    schoolType: "Public",
    financialConstraintLevel: "None",
  },
  academics: {
    gpaUnweighted: 3.85,
    gpaScale: 4.0,
    gpaWeighted: 4.3,
    courseRigor: 8,
    satScore: 1540,
  },
  intendedMajorInfo: {
    primary: "Computer Science",
    secondary: "Public Policy",
    certaintyLevel: 4,
  },
  timeBudget: {
    hoursPerWeekAvailable: 25,
  },
  activities: [
    {
      id: "act-1",
      name: "Algorithmic Bias Research Paper",
      category: "Research",
      hoursPerWeek: 15,
      weeksPerYear: 30,
      yearsInvolved: 2,
      impactLevel: "National",
      role: "Lead Author",
      initiativeLevel: "Leader",
      isPrestigeTheater: false
    },
    {
      id: "act-2",
      name: "City Council Tech Advisory Board",
      category: "Policy/Debate",
      hoursPerWeek: 5,
      weeksPerYear: 40,
      yearsInvolved: 2,
      impactLevel: "Local",
      role: "Youth Advisor",
      initiativeLevel: "Participant",
      isPrestigeTheater: false
    },
    {
      id: "act-3",
      name: "School Tutoring Club",
      category: "Community Service",
      hoursPerWeek: 4,
      weeksPerYear: 36,
      yearsInvolved: 3,
      impactLevel: "Local",
      role: "Member",
      initiativeLevel: "Participant",
      isPrestigeTheater: true
    },
    {
      id: "act-4",
      name: "ML Traffic Prototype",
      category: "Engineering/Product",
      hoursPerWeek: 10,
      weeksPerYear: 20,
      yearsInvolved: 1,
      impactLevel: "Local",
      role: "Founder/Developer",
      initiativeLevel: "Founder",
      isPrestigeTheater: false
    }
  ],
  awards: [
    {
      id: "awd-1",
      name: "State Science Fair - Computer Science (2nd Place)",
      tier: "Tier 3",
      category: "Research"
    },
    {
      id: "awd-2",
      name: "National Merit Semifinalist",
      tier: "Tier 2",
      category: "Other"
    }
  ],
  intendedMajor: "Computer Science and Public Policy",
  targetTier: "T10",
  availableHoursPerWeek: 25,
  geography: "NY"
};
