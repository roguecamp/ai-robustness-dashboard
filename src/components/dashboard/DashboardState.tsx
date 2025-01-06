import { create } from 'zustand';
import { format } from "date-fns";
import { KeyPractice } from '@/types/ratings';

interface DashboardState {
  projectName: string;
  assessmentDate: string;
  pillarRatings: Record<string, KeyPractice[]>;
  setProjectName: (name: string) => void;
  setAssessmentDate: (date: string) => void;
  setPillarRatings: (ratings: Record<string, KeyPractice[]>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  projectName: '',
  assessmentDate: format(new Date(), "yyyy-MM-dd"),
  pillarRatings: {},
  setProjectName: (name) => set({ projectName: name }),
  setAssessmentDate: (date) => set({ assessmentDate: date }),
  setPillarRatings: (ratings) => set({ pillarRatings: ratings }),
}));