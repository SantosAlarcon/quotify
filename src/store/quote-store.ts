import { create } from 'zustand'

export type LayoutPreset = 'classic' | 'modern' | 'bold-quote' | 'minimal'
export type AspectRatio = '1:1' | '4:5' | '1.91:1' | '9:16'

export type QuoteState = {
  name: string
  headline: string
  photo: string | null
  logo: string | null
  cardBgColor: string
  cardTextColor: string
  fontFamily: string
  text: string
  layoutPreset: LayoutPreset
  aspectRatio: AspectRatio
  accentColor: string
}

type QuoteActions = {
  setName: (name: string) => void
  setHeadline: (headline: string) => void
  setPhoto: (photo: string | null) => void
  setLogo: (logo: string | null) => void
  setCardBgColor: (color: string) => void
  setCardTextColor: (color: string) => void
  setFontFamily: (font: string) => void
  setText: (text: string) => void
  setLayoutPreset: (preset: LayoutPreset) => void
  setAspectRatio: (ratio: AspectRatio) => void
  setAccentColor: (color: string) => void
}

const initialState: QuoteState = {
  name: '',
  headline: '',
  photo: null,
  logo: null,
  cardBgColor: '#ffffff',
  cardTextColor: '#1a1a2e',
  fontFamily: 'Georgia, serif',
  text: '',
  layoutPreset: 'classic',
  aspectRatio: '1.91:1',
  accentColor: '#6366f1',
}

export const useQuoteStore = create<QuoteState & QuoteActions>((set) => ({
  ...initialState,
  setName: (name) => set({ name }),
  setHeadline: (headline) => set({ headline }),
  setPhoto: (photo) => set({ photo }),
  setLogo: (logo) => set({ logo }),
  setCardBgColor: (cardBgColor) => set({ cardBgColor }),
  setCardTextColor: (cardTextColor) => set({ cardTextColor }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setText: (text) => set({ text }),
  setLayoutPreset: (layoutPreset) => set({ layoutPreset }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setAccentColor: (accentColor) => set({ accentColor }),
}))
