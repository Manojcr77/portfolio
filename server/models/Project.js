// models/Project.js — Portfolio project schema

const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    tech:        { type: String, required: true },
    github:      { type: String, default: "" },
    live:        { type: String, default: "" },
    image:       { type: String, default: "" }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Project", projectSchema)
