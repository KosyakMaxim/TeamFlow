import { mockTasks } from "@/shared/mocks/tasks";
import { Task, TaskStatus } from "@/shared/types";
import { create } from "zustand";

type TaskFilters = {
  search: string;
  status: "all" | TaskStatus;
};

type TaskStore = {
  tasks: Task[];
  filters: TaskFilters;

  // Actions — мутации стейта
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  setSearch: (search: string) => void;
  setStatusFilter: (status: "all" | TaskStatus) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: mockTasks,
  filters: { search: "", status: "all" },

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (updated) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === updated.id ? updated : t)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),

  setStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),
}));
