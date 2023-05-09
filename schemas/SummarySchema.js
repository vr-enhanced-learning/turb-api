import mongoose from "mongoose"
const Schema = mongoose.Schema

const SummarySchema = new Schema({
	videoId: { type: String, required: true },
	content: { type: String, required: true }
	
}, { timestamps: true })

let Summary = mongoose.model('Summary', SummarySchema)
export default Summary