import { TaskStatus } from "@/shared/types";
import { create } from "zustand";

type TaskFilters = {
  search: string;
  status: "all" | TaskStatus;
};

type TaskStore = {
  filters: TaskFilters;
  setSearch: (search: string) => void;
  setStatusFilter: (status: "all" | TaskStatus) => void;
};

// Стор теперь хранит только фильтры — данные задач управляются TanStack Query
export const useTaskStore = create<TaskStore>((set) => ({
  filters: { search: "", status: "all" },

  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),

  setStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),
}));
