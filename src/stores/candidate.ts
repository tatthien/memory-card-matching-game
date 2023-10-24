import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Candidate } from "@/types";

const LS_CANDIDATE_STORE_KEY = "church_election_candidate_store";

interface State {
  candidates: Candidate[];
  totalBallots: number;
}

type Action = {
  add: (payload: Candidate) => void;
  update: (payload: Partial<Candidate>) => void;
  delete: (id: string) => void;
  clear: () => void;
  updateTotalBallots: (total: number) => void;
};

export const useCandidateStore = create<State & Action>()(
  persist(
    (set, get) => ({
      // state
      candidates: [],
      totalBallots: 100,

      // actions
      add: (payload: Candidate) =>
        set({ candidates: [...get().candidates, payload] }),
      update: (payload: Partial<Candidate>) =>
        set({
          candidates: get().candidates.map((candidate) => {
            return candidate.id === payload.id
              ? { ...candidate, ...payload }
              : candidate;
          }),
        }),
      delete: (id: string) =>
        set({
          candidates: get().candidates.filter(
            (candidate) => candidate.id !== id,
          ),
        }),
      clear: () => set({ candidates: [], totalBallots: 0 }),
      updateTotalBallots: (total: number) => set({ totalBallots: total }),
    }),
    {
      name: LS_CANDIDATE_STORE_KEY,
      partialize: (state) => ({
        candidates: state.candidates,
        totalBallots: state.totalBallots,
      }),
    },
  ),
);
