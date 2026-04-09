// models/Resume.js — Tracks the uploaded resume file path

const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema({
  path:       { type: String, required: true },
  originalName: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("Resume", resumeSchema)
