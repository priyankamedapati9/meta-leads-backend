import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    leadId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    createdTime: String
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);