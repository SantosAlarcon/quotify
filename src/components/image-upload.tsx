'use client'

import { useState, type DragEvent, useRef, useId, type ChangeEvent, useCallback } from 'react'
import { useTranslations } from '../i18n/use-translations'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const MAX_DIMENSION = 512
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg']

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg') {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION)
          width = MAX_DIMENSION
        } else {
          width = Math.round((width / height) * MAX_DIMENSION)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/webp', 0.85))
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

type Props = {
  label: string
  currentImage: string | null
  onImageChange: (dataUrl: string | null) => void
}

function useValidateFile() {
  const { t } = useTranslations()

  return function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return t('imageUpload.errorFormat')
    }
    if (file.size > MAX_FILE_SIZE) {
      return t('imageUpload.errorSize')
    }
    return null
  }
}

export function ImageUpload({ label, currentImage, onImageChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const inputId = `${id}-${label.toLowerCase().replace(/\s+/g, '-')}`
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const { t } = useTranslations()
  const validateFile = useValidateFile()

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const dataUrl = await resizeImage(file)
      onImageChange(dataUrl)
    } catch {
      setError(t('imageUpload.errorSize'))
    }
  }, [validateFile, onImageChange, t])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    handleFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleRemove = () => {
    onImageChange(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="image-upload">
      <span className="image-upload__label" id={`${inputId}-label`}>
        {label}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg"
        onChange={handleChange}
        id={inputId}
        className="visually-hidden"
        aria-labelledby={`${inputId}-label`}
      />
      {currentImage ? (
        <div className="image-upload__preview">
          <img src={currentImage} alt={t('imageUpload.altText', { label })} className="image-upload__thumb" />
          <button
            type="button"
            className="image-upload__remove"
            onClick={handleRemove}
            aria-label={t('imageUpload.removeButton', { label })}
          >
            {t('imageUpload.removeButton', { label })}
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`image-upload__trigger${dragOver ? ' image-upload__trigger--drag-over' : ''}`}
          aria-label={t('imageUpload.uploadLabel', { label })}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {t('imageUpload.uploadButton', { label })}
        </label>
      )}
      {error && (
        <span className="image-upload__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
