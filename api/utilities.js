import {
	SERVERLESS_CAPTIONS_ENDPOINT
} from "../app.js"

export function convertUnicode(text) {
	return text
		.replace(/[\u2018\u2019]/g, "'")
		.replace(/[\u201d]/g, '"')
		.replace(/[\u201c]/g, '"')
		.replace(/\u2014/g, "--")
		.replace(/\u2026/g, "...")
}

export async function captionString(videoId) {
	let captions = await fetch(
		`${SERVERLESS_CAPTIONS_ENDPOINT}/captions?youtubeVideoId=${videoId}&beautify=false`
	)

	captions = await captions.json()
	captions = convertUnicode(captions)

	return captions
}
