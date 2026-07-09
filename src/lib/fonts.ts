export type FontSource = 'google' | 'local' | 'system'

export type FontOption = {
	id: string
	label: string
	fontFamily: string
	category: 'serif' | 'sans-serif' | 'monospace'
	source: FontSource
	googleUrl?: string
}

export const FONT_OPTIONS: FontOption[] = [
	{ id: 'georgia', label: 'Georgia', fontFamily: 'Georgia, serif', category: 'serif', source: 'system' },
	{ id: 'times-new-roman', label: 'Times New Roman', fontFamily: "'Times New Roman', serif", category: 'serif', source: 'system' },
	{ id: 'courier-new', label: 'Courier New', fontFamily: "'Courier New', monospace", category: 'monospace', source: 'system' },
	{ id: 'arial', label: 'Arial', fontFamily: 'Arial, sans-serif', category: 'sans-serif', source: 'system' },

	{ id: 'jost', label: 'Jost', fontFamily: 'Jost, sans-serif', category: 'sans-serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Jost:wght@400;700&display=swap' },
	{ id: 'nunito', label: 'Nunito', fontFamily: "'Nunito', sans-serif", category: 'sans-serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap' },
	{ id: 'playfair-display', label: 'Playfair Display', fontFamily: "'Playfair Display', serif", category: 'serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap' },
	{ id: 'merriweather', label: 'Merriweather', fontFamily: 'Merriweather, serif', category: 'serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap' },
	{ id: 'lora', label: 'Lora', fontFamily: 'Lora, serif', category: 'serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap' },
	{ id: 'cormorant-garamond', label: 'Cormorant Garamond', fontFamily: "'Cormorant Garamond', serif", category: 'serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap' },
	{ id: 'fraunces', label: 'Fraunces', fontFamily: "'Fraunces', serif", category: 'serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700&display=swap' },
	{ id: 'montserrat', label: 'Montserrat', fontFamily: "'Montserrat', sans-serif", category: 'sans-serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap' },
	{ id: 'poppins', label: 'Poppins', fontFamily: "'Poppins', sans-serif", category: 'sans-serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap' },
	{ id: 'work-sans', label: 'Work Sans', fontFamily: "'Work Sans', sans-serif", category: 'sans-serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap' },
	{ id: 'dm-sans', label: 'DM Sans', fontFamily: "'DM Sans', sans-serif", category: 'sans-serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap' },
	{ id: 'space-grotesk', label: 'Space Grotesk', fontFamily: "'Space Grotesk', sans-serif", category: 'sans-serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap' },
	{ id: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', fontFamily: "'Plus Jakarta Sans', sans-serif", category: 'sans-serif', source: 'google', googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap' },
]

export function getFontByFamily(fontFamily: string): FontOption | undefined {
	return FONT_OPTIONS.find(f => f.fontFamily === fontFamily)
}

export function getFontById(id: string): FontOption | undefined {
	return FONT_OPTIONS.find(f => f.id === id)
}

export function getPrimaryFontName(fontFamily: string): string {
	const primary = fontFamily.split(',')[0]?.trim().replace(/['"]/g, '') ?? fontFamily
	return primary
}
