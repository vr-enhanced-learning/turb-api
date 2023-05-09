import express from "express"
import dotenv from "dotenv"
import Database from "./database.js"
import { cors } from "./middleware.js"

dotenv.config()

export const SERVERLESS_CAPTIONS_ENDPOINT = "https://youtube-questions.vercel.app"
export const SUMMARIZER_MODULE_INFERENCE_ENDPOINT = "https://currentlyexhausted-flan-t5-summarizer.hf.space/run/predict"
export const QUESTION_GENERATION_MODULE_INFERENCE_ENDPOINT = "https://currentlyexhausted-question-generator.hf.space/run/predict"

const app = express()
const PORT = process.env.PORT || 3003

new Database().start().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", cors, (_, res) => {
	res.status(200).send("API is online")
})

app.get("/:videoId", cors, async (_, res) => {
    let videoId = req.params.videoId

    if(videoId == "") return res.status(400).send("Send videoId")

    let captions = await fetch(`${SERVERLESS_CAPTIONS_ENDPOINT}videoId`)

	res.status(200).send("API is online")
})