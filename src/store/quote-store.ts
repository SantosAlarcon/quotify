import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TemplateConfig } from "../lib/templates";

export type LayoutPreset = "classic" | "modern" | "bold-quote" | "minimal" | "centered" | "split" | "gradient";
export type AspectRatio = "1:1" | "4:5" | "1.91:1" | "9:16";
export type TextAlign = "left" | "center" | "right";
export type LogoPosition = "left" | "center" | "right";
export type BgType = "solid" | "gradient";

export type QuoteState = {
	name: string;
	headline: string;
	photo: string | null;
	logo: string | null;
	logoOpacity: number;
	logoPosition: LogoPosition;
	cardBgColor: string;
	cardTextColor: string;
	fontFamily: string;
	fontSize: number;
	textAlign: TextAlign;
	text: string;
	layoutPreset: LayoutPreset;
	aspectRatio: AspectRatio;
	accentColor: string;
	bgType: BgType;
	bgGradient: string;
	isFontReady: boolean;
	customFont: { name: string; dataUrl: string } | null;
};

type QuoteActions = {
	setName: (name: string) => void;
	setHeadline: (headline: string) => void;
	setPhoto: (photo: string | null) => void;
	setLogo: (logo: string | null) => void;
	setLogoOpacity: (opacity: number) => void;
	setLogoPosition: (position: LogoPosition) => void;
	setCardBgColor: (color: string) => void;
	setCardTextColor: (color: string) => void;
	setFontFamily: (font: string) => void;
	setFontSize: (size: number) => void;
	setTextAlign: (align: TextAlign) => void;
	setText: (text: string) => void;
	setLayoutPreset: (preset: LayoutPreset) => void;
	setAspectRatio: (ratio: AspectRatio) => void;
	setAccentColor: (color: string) => void;
	setBgType: (type: BgType) => void;
	setBgGradient: (gradient: string) => void;
	setFontReady: (ready: boolean) => void;
	setCustomFont: (font: { name: string; dataUrl: string } | null) => void;
	loadTemplate: (config: TemplateConfig) => void;
	reset: () => void;
};

const initialState: QuoteState = {
	name: "",
	headline: "",
	photo: null,
	logo: null,
	logoOpacity: 0.5,
	logoPosition: "right",
	cardBgColor: "#ffffff",
	cardTextColor: "#1a1a2e",
	fontFamily: "Georgia, serif",
	fontSize: 32,
	textAlign: "left",
	text: "",
	layoutPreset: "classic",
	aspectRatio: "1:1",
	accentColor: "#6366f1",
	bgType: "solid",
	bgGradient: "",
	isFontReady: true,
	customFont: null,
};

export const useQuoteStore = create<QuoteState & QuoteActions>()(
	persist(
		(set) => ({
			...initialState,
			setName: (name) => set({ name }),
			setHeadline: (headline) => set({ headline }),
			setPhoto: (photo) => set({ photo }),
			setLogo: (logo) => set({ logo }),
			setLogoOpacity: (logoOpacity) => set({ logoOpacity }),
			setLogoPosition: (logoPosition) => set({ logoPosition }),
			setCardBgColor: (cardBgColor) => set({ cardBgColor }),
			setCardTextColor: (cardTextColor) => set({ cardTextColor }),
			setFontFamily: (fontFamily) => set({ fontFamily }),
			setFontSize: (fontSize) => set({ fontSize }),
			setTextAlign: (textAlign) => set({ textAlign }),
			setText: (text) => set({ text }),
			setLayoutPreset: (layoutPreset) => set({ layoutPreset }),
			setAspectRatio: (aspectRatio) => set({ aspectRatio }),
			setAccentColor: (accentColor) => set({ accentColor }),
			setBgType: (bgType) => set({ bgType }),
			setBgGradient: (bgGradient) => set({ bgGradient }),
			setFontReady: (isFontReady) => set({ isFontReady }),
			setCustomFont: (customFont) => set({ customFont }),
			loadTemplate: (config) =>
				set({
					...config,
					text: "",
					name: "",
					headline: "",
					customFont: null,
				}),
			reset: () => set({ ...initialState, isFontReady: true }),
		}),
		{
			name: "quotify-store",
			partialize: (state) => {
				const { isFontReady, ...rest } = state;
				return rest;
			},
		},
	),
);
