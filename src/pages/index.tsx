import { Editor } from '../components/editor'
import { PreviewSection } from '../components/preview-section'

export default async function HomePage() {
  return (
    <>
      <div className="editor-panel">
        <Editor />
      </div>
      <div className="preview-panel">
        <PreviewSection />
      </div>
    </>
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
