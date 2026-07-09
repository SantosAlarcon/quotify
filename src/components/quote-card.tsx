import { marked } from 'marked'
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

export function QuoteCardContent({
  text,
  name,
  headline,
  photo,
  logo,
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
  const layout = layoutPreset
  const alignClass = ALIGN_CLASS[textAlign]
  const bgStyle: React.CSSProperties =
    bgType === 'gradient' && bgGradient
      ? { backgroundImage: bgGradient }
      : { backgroundColor: cardBgColor }

  return (
    <div
      className={`card-content layout-${layout}`}
      style={{
        aspectRatio: RATIO_STYLE[aspectRatio] ?? '1.91 / 1',
        color: cardTextColor,
        fontFamily,
        ...bgStyle,
      }}
    >
      {layout === 'bold-quote' && (
        <span
          className='card-dq'
          style={{ color: accentColor }}
          aria-hidden='true'
        >
          &ldquo;
        </span>
      )}

      {layout !== 'minimal' && layout !== 'modern' && (
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

      {layout === 'modern' && (
        <div className='card-accent-bar' style={{ backgroundColor: accentColor }} />
      )}

      {layout === 'modern' && (
        <div className='card-text-wrap'>
          {text && (
            <div
              className={`card-text ${alignClass}`}
              style={{ color: cardTextColor, fontFamily, fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: marked.parse(text, { async: false }) }}
            />
          )}
        </div>
      )}

      {layout !== 'modern' && text && (
        <div
          className={`card-text ${alignClass}`}
          style={{ color: cardTextColor, fontFamily, fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: marked.parse(text, { async: false }) }}
        />
      )}

      {layout === 'modern' && (
        <footer className='card-footer'>
          {photo && <img src={photo} alt='' className='card-photo card-photo--sm' />}
          <div>
            {name && <h2 className='card-name'>{name}</h2>}
            {headline && <p className='card-headline'>{headline}</p>}
          </div>
        </footer>
      )}

      {layout === 'minimal' && name && (
        <p className='card-minimal-att' style={{ color: accentColor }}>
          &mdash; {name}
        </p>
      )}

      {layout !== 'minimal' && logo && (
        <img
          src={logo}
          alt=''
          className='card-logo'
        />
      )}
    </div>
  )
}
