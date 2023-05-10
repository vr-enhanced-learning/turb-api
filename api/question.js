import express from "express"
import fetch from "node-fetch"
import { cors } from "../middleware.js"
import Question from "../schemas/QuestionSchema.js"
import {
	SERVERLESS_CAPTIONS_ENDPOINT,
	QUESTION_GENERATION_MODULE_INFERENCE_ENDPOINT,
} from "../app.js"

const app = express()
const router = express.Router()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.status(200).send("QUESTIONS API ONLINE")
})

router.get("/:videoId", cors, async (req, res) => {
	try {
		let videoId = req.params.videoId

		if (videoId == "") return res.status(400).send("Send videoId")

		let data = await Question.findOne({ videoId: videoId })
		if (data) return res.status(200).send(data.content)

		let captions = await fetch(
			`${SERVERLESS_CAPTIONS_ENDPOINT}/captions?youtubeVideoId=${videoId}&beautify=false`
		)

		let array = getSentences(captions)
		let questions = await getResponses(array)

		await Question.create({
			videoId: videoId,
			content: questions,
		})

		res.status(200).send(questions)
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
})

router.delete("/:videoId", cors, async (req, res) => {
	try {
		let videoId = req.params.videoId

		if (videoId == "") return res.status(400).send("Send videoId")

		await Question.deleteOne({ videoId: videoId })

		res.status(200).send("Deleted")
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
})

function getSentences(text, num_of_sentences = 5) {
	text = String(text) // Convert to string if necessary
	const length = text.length
	const length_of_each_part = Math.floor(length / num_of_sentences)
	const new_array = []
	for (let i = 0; i < num_of_sentences; i++) {
		new_array.push(
			text.slice(i * length_of_each_part, (i + 1) * length_of_each_part)
		)
	}
	return new_array
}

async function getResponses(array) {
	const questionsArray = []
	for (const sentence of array) {
		console.log(`Generating Question ${array.indexOf(sentence) + 1}...`)
		const parsedSentence = parse(sentence)
		const response = await fetch(
			QUESTION_GENERATION_MODULE_INFERENCE_ENDPOINT,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					data: [parsedSentence],
				}),
			}
		).then((res) => res.json())
		questionsArray.push(response.data[0])
	}
	return questionsArray
}

function parse(array) {
	let text = ""
	for (const item of array) {
		text += item
	}
	return text
}

export default router
