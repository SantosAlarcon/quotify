import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";

type ThemeState = {
	mode: ThemeMode;
};

type ThemeActions = {
	setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState & ThemeActions>()(
	persist(
		(set) => ({
			mode: "system",
			setMode: (mode) => set({ mode }),
		}),
		{
			name: "quotify-theme",
			partialize: (state) => ({ mode: state.mode }),
		},
	),
);
