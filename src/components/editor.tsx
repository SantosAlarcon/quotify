'use client'

import type { LayoutPreset, AspectRatio } from '../store/quote-store'
import { useQuoteStore } from '../store/quote-store'
import { ImageUpload } from './image-upload'

const LAYOUTS: { value: LayoutPreset; label: string }[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'bold-quote', label: 'Bold Quote' },
  { value: 'minimal', label: 'Minimal' },
]

const RATIOS: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Square' },
  { value: '4:5', label: 'Portrait' },
  { value: '1.91:1', label: 'OG' },
  { value: '9:16', label: 'Story' },
]

export function Editor() {
  const {
    text,
    setName,
    setHeadline,
    setPhoto,
    setLogo,
    setCardBgColor,
    setCardTextColor,
    setFontFamily,
    setText,
    setLayoutPreset,
    setAspectRatio,
    setAccentColor,
    name,
    headline,
    photo,
    logo,
    cardBgColor,
    cardTextColor,
    fontFamily,
    layoutPreset,
    aspectRatio,
    accentColor,
  } = useQuoteStore()

  return (
    <form className='editor' onSubmit={(e) => e.preventDefault()}>
      <section className='editor__section'>
        <h2>Layout</h2>
        <div className='preset-grid'>
          {LAYOUTS.map((l) => (
            <button
              key={l.value}
              type='button'
              className={`preset-btn layout-${l.value}${layoutPreset === l.value ? ' preset-btn--active' : ''}`}
              onClick={() => setLayoutPreset(l.value)}
              aria-pressed={layoutPreset === l.value}
              style={layoutPreset === l.value ? { borderColor: accentColor } : undefined}
            >
              <span className='preset-btn__preview' />
              <span className='preset-btn__label'>{l.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className='editor__section'>
        <h2>Aspect Ratio</h2>
        <div className='ratio-grid'>
          {RATIOS.map((r) => (
            <button
              key={r.value}
              type='button'
              className={`ratio-btn${aspectRatio === r.value ? ' ratio-btn--active' : ''}`}
              onClick={() => setAspectRatio(r.value)}
              aria-pressed={aspectRatio === r.value}
              style={aspectRatio === r.value ? { borderColor: accentColor } : undefined}
            >
              <span className={`ratio-btn__thumb ratio-btn__thumb--${r.value.replace(':', '-')}`} />
              <span className='ratio-btn__label'>{r.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className='editor__section'>
        <h2>Quote</h2>
        <label>
          <span>
            Quote text <small>(Markdown supported)</small>
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder='Enter your quote... **bold**, *italic*, [links](url)'
          />
        </label>
      </section>

      <section className='editor__section'>
        <h2>Profile</h2>
        <label>
          <span>Name</span>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Your name'
          />
        </label>
        <label>
          <span>Headline</span>
          <input
            type='text'
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder='Your title or tagline'
          />
        </label>
        <ImageUpload label='Photo' currentImage={photo} onImageChange={setPhoto} />
      </section>

      <section className='editor__section'>
        <h2>Branding</h2>
        <ImageUpload label='Logo' currentImage={logo} onImageChange={setLogo} />
        <label>
          <span>Accent color</span>
          <input type='color' value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
        </label>
        <label>
          <span>Background color</span>
          <input
            type='color'
            value={cardBgColor}
            onChange={(e) => setCardBgColor(e.target.value)}
          />
        </label>
        <label>
          <span>Text color</span>
          <input
            type='color'
            value={cardTextColor}
            onChange={(e) => setCardTextColor(e.target.value)}
          />
        </label>
      </section>

      <section className='editor__section'>
        <h2>Typography</h2>
        <label>
          <span>Font</span>
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value='Georgia, serif'>Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Nunito', sans-serif">Nunito</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value='Arial, sans-serif'>Arial</option>
          </select>
        </label>
      </section>
    </form>
  )
}
