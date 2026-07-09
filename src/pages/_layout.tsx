import '../styles.css'

import type { ReactNode } from 'react'
import { Footer } from '../components/footer'
import { Header } from '../components/header'

type RootLayoutProps = { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<>
			<head>
				<title>Quotify — Quote Image Generator</title>
			</head>
			<Header />
			<main className="app__main">{children}</main>
			<Footer />
		</>
	)
}

export const getConfig = async () => {
	return {
		render: 'static',
	} as const
}
