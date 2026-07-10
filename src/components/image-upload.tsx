'use client'

import { useState, type DragEvent, useRef, useId, type ChangeEvent } from 'react'
import { useTranslations } from '../i18n/use-translations'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg']

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

  const handleFile = (file: File) => {
    setError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onImageChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

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
