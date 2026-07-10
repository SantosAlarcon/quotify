import "../styles.css";

import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { PageTitle } from "../components/page-title";
import { Description } from "../components/description";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<>
			<head>
				<PageTitle />
				<Description />
				<link rel="icon" type="image/ico" href="/images/favicon.ico" />
			</head>
			<Header />
			<main className="app__main">{children}</main>
			<Footer />
		</>
	);
}

export const getConfig = async () => {
	return {
		render: "static",
	} as const;
};
