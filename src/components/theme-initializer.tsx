"use client";

import { useEffect } from "react";
import { useThemeStore } from "../store/theme-store";

export function ThemeInitializer() {
	const mode = useThemeStore((s) => s.mode);

	useEffect(() => {
		const root = document.documentElement;
		if (mode === "system") {
			root.style.removeProperty("color-scheme");
		} else {
			root.style.colorScheme = mode;
		}
	}, [mode]);

	return null;
}
