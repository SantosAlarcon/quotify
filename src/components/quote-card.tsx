'use client'

import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { QuoteState, TextAlign } from '../store/quote-store'

const RATIO_STYLE: Record<string, string> = {
  '1:1': '1 / 1',
  '4:5': '4 / 5',
  '1.91:1': '1.91 / 1',
  '9:16': '9 / 16',
}

export type CardProps = Pick<
  QuoteState,
  | 'text'
  | 'name'
  | 'headline'
  | 'photo'
  | 'logo'
  | 'logoOpacity'
  | 'logoPosition'
  | 'cardBgColor'
  | 'cardTextColor'
  | 'fontFamily'
  | 'fontSize'
  | 'textAlign'
  | 'layoutPreset'
  | 'aspectRatio'
  | 'accentColor'
  | 'bgType'
  | 'bgGradient'
>

const ALIGN_CLASS: Record<TextAlign, string> = {
  left: 'card-text--left',
  center: 'card-text--center',
  right: 'card-text--right',
}

function renderMarkdown(text: string): string {
  const raw = marked.parse(text, { async: false }) as string
  if (typeof window === 'undefined') return raw
  return DOMPurify.sanitize(raw)
}

export function QuoteCardContent({
  text,
  name,
  headline,
  photo,
  logo,
  logoOpacity = 0.5,
  logoPosition = 'right',
  cardBgColor,
  cardTextColor,
  fontFamily,
  fontSize = 32,
  textAlign = 'left',
  layoutPreset = 'classic',
  aspectRatio = '1.91:1',
  accentColor = '#6366f1',
  bgType = 'solid',
  bgGradient = '',
}: CardProps) {
  const alignClass = ALIGN_CLASS[textAlign]
  const logoPosStyle: React.CSSProperties =
    logoPosition === 'left'
      ? { left: '1.25rem', right: 'auto' }
      : logoPosition === 'center'
        ? { left: '50%', right: 'auto', transform: 'translateX(-50%)' }
        : { right: '1.25rem' }
  const bgStyle: React.CSSProperties =
    bgType === 'gradient' && bgGradient
      ? { backgroundImage: bgGradient }
      : { backgroundColor: cardBgColor }

  return (
    <div
      className={`card-content layout-${layoutPreset}`}
      style={{
        aspectRatio: RATIO_STYLE[aspectRatio] ?? '1.91 / 1',
        color: cardTextColor,
        fontFamily,
        ...bgStyle,
      }}
    >
      {layoutPreset === 'bold-quote' && (
        <span
          className='card-dq'
          style={{ color: accentColor }}
          aria-hidden='true'
        >
          &ldquo;
        </span>
      )}

      {layoutPreset !== 'minimal' && layoutPreset !== 'modern' && (
        <header className='card-header'>
          {photo && (
            <img
              src={photo}
              alt=''
              className='card-photo'
            />
          )}
          <div className='card-identity'>
            {name && <h2 className='card-name'>{name}</h2>}
            {headline && <p className='card-headline'>{headline}</p>}
          </div>
        </header>
      )}

      {layoutPreset === 'modern' && (
        <div className='card-accent-bar' style={{ backgroundColor: accentColor }} />
      )}

      {layoutPreset === 'modern' && (
        <div className='card-text-wrap'>
          {text ? (
            <div
              className={`card-text ${alignClass}`}
              style={{ color: cardTextColor, fontFamily, fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
            />
          ) : (
            <div className={`card-text card-text--empty ${alignClass}`}>
              <p>Your quote will appear here</p>
            </div>
          )}
        </div>
      )}

      {layoutPreset !== 'modern' && (
        text ? (
          <div
            className={`card-text ${alignClass}`}
            style={{ color: cardTextColor, fontFamily, fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />
        ) : (
          <div className={`card-text card-text--empty ${alignClass}`}>
            <p>Your quote will appear here</p>
          </div>
        )
      )}

      {layoutPreset === 'modern' && (
        <footer className='card-footer'>
          {photo && <img src={photo} alt='' className='card-photo card-photo--sm' />}
          <div>
            {name && <h2 className='card-name'>{name}</h2>}
            {headline && <p className='card-headline'>{headline}</p>}
          </div>
        </footer>
      )}

      {layoutPreset === 'minimal' && name && (
        <p className='card-minimal-att' style={{ color: accentColor }}>
          &mdash; {name}
        </p>
      )}

      {layoutPreset !== 'minimal' && logo && (
        <img
          src={logo}
          alt=''
          className='card-logo'
          style={{ opacity: logoOpacity, ...logoPosStyle }}
        />
      )}
    </div>
  )
}
