import express from "express"
import Summary from "../schemas/SummarySchema.js"
import { cors } from "../middleware.js"
import {
	SUMMARIZER_MODULE_INFERENCE_ENDPOINT,
} from "../app.js"
import { captionString } from "./utilities.js"

const app = express()
const router = express.Router()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.status(200).send("SUMMARY API ONLINE")
})

router.get("/:videoId", cors, async (req, res) => {
	try {
		let videoId = req.params.videoId

		if (videoId == "") return res.status(400).send("Send videoId")

		let data = await Summary.findOne({ videoId: videoId })
		if (data) return res.status(200).send(data.content)

		let captions = await captionString(videoId)

		let summary = await getSummary(captions)

		await Summary.create({
			videoId: videoId,
			content: summary,
		})

		res.status(200).send(summary)
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
})

router.delete("/:videoId", cors, async (req, res) => {
	try {
		let videoId = req.params.videoId

		if (videoId == "") return res.status(400).send("Send videoId")

		await Summary.deleteOne({ videoId: videoId })

		res.status(200).send("Deleted")
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
})

async function getSummary(captions) {
	let request = await fetch(SUMMARIZER_MODULE_INFERENCE_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			data: [captions],
		}),
	})

	let response = await request.json()
	return response.data[0]
}

export default router
