import "../styles.css";

import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
	const data = await getData();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<title>Quotify — Quote Image Generator</title>
				<meta name="description" content={data.description} />
				<link rel="icon" type="image/icon" href={data.icon} />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap"
				/>
			</head>
			<body className="app">
				<Header />
				<main className="app__main">{children}</main>
				<Footer />
			</body>
		</html>
	);
}

const getData = async () => {
	const data = {
		description: "Generate beautiful quote images for social media",
		icon: "/images/favicon.ico",
	};

	return data;
};

export const getConfig = async () => {
	return {
		render: "static",
	} as const;
};
