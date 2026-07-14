import { ImageResponse } from "takumi-js/response";
import { buildQuoteCard, type CardExportState } from "../../lib/takumi-card";

const MAX_BODY_SIZE = 5 * 1024 * 1024; // 5MB

const VALID_LOCALES = new Set([
	"ca",
	"de",
	"en",
	"es",
	"fr",
	"it",
	"ja",
	"ko",
	"pt",
]);

export const POST = async (request: Request): Promise<Response> => {
	try {
		const rawBody = await request.arrayBuffer();
		if (rawBody.byteLength > MAX_BODY_SIZE) {
			return Response.json({ error: "Request too large" }, { status: 413 });
		}

		const body: CardExportState = JSON.parse(new TextDecoder().decode(rawBody));

		const rawHeader = request.headers.get("accept-language") || "";
		const locale = rawHeader.slice(0, 2);
		const resolvedLocale = VALID_LOCALES.has(locale) ? locale : "en";

		let emptyText = "Your quote will appear here";
		try {
			const { default: translations } = await import(
				`../../i18n/locales/${resolvedLocale}.json`
			);
			emptyText = translations?.quoteCard?.empty || emptyText;
		} catch {
			// fallback to English
		}

		const { node, options } = await buildQuoteCard({
			text: body.text ?? "",
			name: body.name ?? "",
			headline: body.headline ?? "",
			photo: body.photo ?? null,
			logo: body.logo ?? null,
			logoOpacity: body.logoOpacity ?? 0.5,
			logoPosition: body.logoPosition ?? "right",
			cardBgColor: body.cardBgColor ?? "#ffffff",
			cardTextColor: body.cardTextColor ?? "#1a1a2e",
			fontFamily: body.fontFamily ?? "Times New Roman, serif",
			fontSize: body.fontSize ?? 32,
			textAlign: body.textAlign ?? "left",
			layoutPreset: body.layoutPreset ?? "classic",
			aspectRatio: body.aspectRatio ?? "1.91:1",
			accentColor: body.accentColor ?? "#6366f1",
			bgType: body.bgType ?? "solid",
			bgGradient: body.bgGradient ?? "",
			customFont: body.customFont ?? null,
			emptyText,
		});

		console.log(options);

		return new ImageResponse(node, {
			...options,
			status: 200,
		});
	} catch (err) {
		console.error("Export render failed:", err);
		return Response.json({ error: "Render failed" }, { status: 500 });
	}
};
