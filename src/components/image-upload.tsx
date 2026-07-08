'use client'

import { useRef, useId, type ChangeEvent } from 'react'

type Props = {
	label: string
	currentImage: string | null
	onImageChange: (dataUrl: string | null) => void
}

export function ImageUpload({ label, currentImage, onImageChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null)
	const id = useId()
	const inputId = `${id}-${label.toLowerCase().replace(/\s+/g, '-')}`

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = () => {
			onImageChange(reader.result as string)
		}
		reader.readAsDataURL(file)
	}

	const handleRemove = () => {
		onImageChange(null)
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
				accept="image/*"
				onChange={handleChange}
				id={inputId}
				className="visually-hidden"
				aria-labelledby={`${inputId}-label`}
			/>
			{currentImage ? (
				<div className="image-upload__preview">
					<img src={currentImage} alt="" className="image-upload__thumb" />
					<button
						type="button"
						className="image-upload__remove"
						onClick={handleRemove}
						aria-label="Remove photo"
					>
						Remove {label}
					</button>
				</div>
			) : (
				<label htmlFor={inputId} className="image-upload__trigger" aria-label="Upload photo" tabIndex={0}>
					+ Upload {label}
				</label>
			)}
		</div>
	)
}
