import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  StudentProfile,
  PersonalProfile,
  AcademicProfile,
  IntendedMajor,
  Activity,
  Award,
} from "@/engine/core/types";

interface ProfileState {
  profile: StudentProfile;
  setProfile: (profile: StudentProfile) => void;
  updatePersonal: (personal: Partial<PersonalProfile>) => void;
  updateAcademics: (academics: Partial<AcademicProfile>) => void;
  updateIntendedMajor: (major: Partial<IntendedMajor>) => void;
  updateTimeBudget: (budget: { hoursPerWeekAvailable: number }) => void;
  updateTargetTier: (tier: StudentProfile["targetTier"]) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  removeActivity: (id: string) => void;
  addAward: (award: Award) => void;
  updateAward: (id: string, award: Partial<Award>) => void;
  removeAward: (id: string) => void;
}

const defaultProfile: StudentProfile = {
  personal: {
    gradeLevel: 11,
    geography: "CA",
    schoolType: "Public",
    financialConstraintLevel: "None",
  },
  academics: {
    gpaUnweighted: 0.0,
    gpaScale: 4.0,
    gpaWeighted: 0.0,
    courseRigor: 5,
  },
  intendedMajorInfo: {
    primary: "",
    certaintyLevel: 3,
  },
  intendedMajor: "", // derived from primary
  timeBudget: {
    hoursPerWeekAvailable: 20,
  },
  availableHoursPerWeek: 20, // derived from timeBudget
  geography: "CA", // derived from personal
  targetTier: "T20",
  activities: [],
  awards: [],
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,

      setProfile: (profile) => set({ profile }),

      updatePersonal: (personal) =>
        set((state) => {
          const updated = { ...state.profile.personal, ...personal };
          return {
            profile: {
              ...state.profile,
              personal: updated,
              geography: updated.geography, // keep legacy sync
            },
          };
        }),

      updateAcademics: (academics) =>
        set((state) => ({
          profile: {
            ...state.profile,
            academics: { ...state.profile.academics, ...academics },
          },
        })),

      updateIntendedMajor: (major) =>
        set((state) => {
          const updated = { ...state.profile.intendedMajorInfo, ...major };
          return {
            profile: {
              ...state.profile,
              intendedMajorInfo: updated,
              intendedMajor: updated.primary, // keep legacy sync
            },
          };
        }),

      updateTimeBudget: (budget) =>
        set((state) => ({
          profile: {
            ...state.profile,
            timeBudget: budget,
            availableHoursPerWeek: budget.hoursPerWeekAvailable, // keep legacy sync
          },
        })),
        
      updateTargetTier: (tier) =>
        set((state) => ({
          profile: {
            ...state.profile,
            targetTier: tier,
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
    }),
    {
      name: "harmon-onboarding-storage",
    }
  )
);
