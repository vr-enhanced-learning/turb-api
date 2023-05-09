import mongoose from "mongoose"
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
	videoId: { type: String, required: true },
	content: { type: Array, required: true }
	
}, { timestamps: true })

let Question = mongoose.model('Question', QuestionSchema)
export default Question