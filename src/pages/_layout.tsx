import "../styles.css";

import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { PageTitle } from "../components/page-title";
import { Description } from "../components/description";
import { ThemeInitializer } from "../components/theme-initializer";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<>
			<head>
				<PageTitle />
				<Description />
				<link rel="icon" type="image/ico" href="/images/favicon.ico" />
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#6f66ff" />
				<link rel="preload" href="/fonts/Nunito-VF.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
			</head>
			<ThemeInitializer />
			<Header />
			<main className="app__main">{children}</main>
			<Footer />
			<script
				dangerouslySetInnerHTML={{
					__html: `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
					`,
				}}
			/>
		</>
	);
}

export const getConfig = async () => {
	return {
		render: "static",
	} as const;
};
