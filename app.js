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

// API Routes
import question from "./api/question.js"
import summary from "./api/summary.js"

app.use("/api/question", cors, question)
app.use("/api/summary", cors, summary)

app.get("/", cors, (_, res) => {
	res.status(200).send("TURB P2 and P3 Module API is online")
})
