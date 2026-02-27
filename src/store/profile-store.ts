import { create } from "zustand";
import type {
  StudentProfile,
  Activity,
  Award,
  Recommender,
  Academics,
} from "@/types/profile";

interface ProfileState {
  profile: StudentProfile;
  setProfile: (profile: StudentProfile) => void;
  updateAcademics: (academics: Partial<Academics>) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  removeActivity: (id: string) => void;
  addAward: (award: Award) => void;
  updateAward: (id: string, award: Partial<Award>) => void;
  removeAward: (id: string) => void;
  addRecommender: (recommender: Recommender) => void;
  updateRecommender: (id: string, recommender: Partial<Recommender>) => void;
  removeRecommender: (id: string) => void;
  updateBasicInfo: (info: Partial<Pick<StudentProfile, "firstName" | "lastName" | "gradeLevel">>) => void;
}

const defaultProfile: StudentProfile = {
  firstName: "Alex",
  lastName: "Chen",
  gradeLevel: 11,
  academics: {
    gpa: 3.85,
    courseRigor: "ap_ib",
    satScore: 1480,
    actScore: null,
    intendedMajor: "Computer Science",
  },
  activities: [
    {
      id: "act-1",
      title: "Robotics Club",
      category: "stem",
      yearsActive: 3,
      weeklyHours: 8,
      leadershipLevel: "vice_president",
      initiativeOwnership: true,
      impactScope: "regional",
      measurableOutcomes: "Led team to regional championship finals; designed autonomous navigation system adopted by 3 other teams",
    },
    {
      id: "act-2",
      title: "Code for Community",
      category: "community_service",
      yearsActive: 2,
      weeklyHours: 5,
      leadershipLevel: "founder",
      initiativeOwnership: true,
      impactScope: "local",
      measurableOutcomes: "Founded nonprofit coding workshops serving 120+ underserved middle school students across 4 schools",
    },
    {
      id: "act-3",
      title: "Math Olympiad Team",
      category: "academic",
      yearsActive: 3,
      weeklyHours: 4,
      leadershipLevel: "active_member",
      initiativeOwnership: false,
      impactScope: "state",
      measurableOutcomes: "State qualifier in AMC/AIME; top 15% nationally in AMC 12",
    },
    {
      id: "act-4",
      title: "Machine Learning Research",
      category: "research",
      yearsActive: 1,
      weeklyHours: 6,
      leadershipLevel: "active_member",
      initiativeOwnership: false,
      impactScope: "school",
      measurableOutcomes: "Conducting NLP research under university mentor; working paper on sentiment analysis in educational contexts",
    },
    {
      id: "act-5",
      title: "Cross Country",
      category: "athletics",
      yearsActive: 2,
      weeklyHours: 10,
      leadershipLevel: "member",
      initiativeOwnership: false,
      impactScope: "school",
      measurableOutcomes: "Varsity letter; improved personal best by 2 minutes over two seasons",
    },
  ],
  awards: [
    {
      id: "awd-1",
      title: "USACO Silver Division",
      level: "national",
      year: 2025,
      description: "Advanced to Silver division in USA Computing Olympiad",
    },
    {
      id: "awd-2",
      title: "Regional Science Fair — First Place",
      level: "regional",
      year: 2024,
      description: "First place in Engineering category for autonomous drone navigation project",
    },
    {
      id: "awd-3",
      title: "AP Scholar with Distinction",
      level: "national",
      year: 2025,
      description: "Scored 4 or higher on five AP exams",
    },
  ],
  recommenders: [
    {
      id: "rec-1",
      name: "Dr. Sarah Mitchell",
      subject: "AP Computer Science",
      strengthRating: 5,
      narrativeAlignmentTag: "Innovation",
    },
    {
      id: "rec-2",
      name: "Mr. James Park",
      subject: "AP Calculus BC",
      strengthRating: 4,
      narrativeAlignmentTag: "Analytical Thinking",
    },
  ],
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: defaultProfile,

  setProfile: (profile) => set({ profile }),

  updateBasicInfo: (info) =>
    set((state) => ({
      profile: { ...state.profile, ...info },
    })),

  updateAcademics: (academics) =>
    set((state) => ({
      profile: {
        ...state.profile,
        academics: { ...state.profile.academics, ...academics },
      },
    })),

  addActivity: (activity) =>
    set((state) => ({
      profile: {
        ...state.profile,
        activities: [...state.profile.activities, activity],
      },
    })),

  updateActivity: (id, updates) =>
    set((state) => ({
      profile: {
        ...state.profile,
        activities: state.profile.activities.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      },
    })),

  removeActivity: (id) =>
    set((state) => ({
      profile: {
        ...state.profile,
        activities: state.profile.activities.filter((a) => a.id !== id),
      },
    })),

  addAward: (award) =>
    set((state) => ({
      profile: {
        ...state.profile,
        awards: [...state.profile.awards, award],
      },
    })),

  updateAward: (id, updates) =>
    set((state) => ({
      profile: {
        ...state.profile,
        awards: state.profile.awards.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      },
    })),

  removeAward: (id) =>
    set((state) => ({
      profile: {
        ...state.profile,
        awards: state.profile.awards.filter((a) => a.id !== id),
      },
    })),

  addRecommender: (recommender) =>
    set((state) => ({
      profile: {
        ...state.profile,
        recommenders: [...state.profile.recommenders, recommender],
      },
    })),

  updateRecommender: (id, updates) =>
    set((state) => ({
      profile: {
        ...state.profile,
        recommenders: state.profile.recommenders.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      },
    })),

  removeRecommender: (id) =>
    set((state) => ({
      profile: {
        ...state.profile,
        recommenders: state.profile.recommenders.filter((r) => r.id !== id),
      },
    })),
}));
