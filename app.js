import express from "express"
import fetch from "node-fetch"
import { cors } from "./middleware.js"

const SERVERLESS_CAPTIONS_ENDPOINT = "https://youtube-questions.vercel.app/captions?youtubeVideoId="

const app = express()
const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
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