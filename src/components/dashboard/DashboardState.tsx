import { create } from 'zustand';
import { format } from "date-fns";

interface DashboardState {
  projectName: string;
  assessmentDate: string;
  pillarRatings: Record<string, { name: string; rating: string | null }[]>;
  setProjectName: (name: string) => void;
  setAssessmentDate: (date: string) => void;
  setPillarRatings: (pillarTitle: string, practices: { name: string; rating: string | null }[]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  projectName: '',
  assessmentDate: format(new Date(), "yyyy-MM-dd"),
  pillarRatings: {},
  setProjectName: (name) => set({ projectName: name }),
  setAssessmentDate: (date) => set({ assessmentDate: date }),
  setPillarRatings: (pillarTitle, practices) => 
    set((state) => ({
      pillarRatings: {
        ...state.pillarRatings,
        [pillarTitle]: practices
      }
    })),
}));