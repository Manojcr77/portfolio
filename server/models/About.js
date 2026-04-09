// models/About.js — Single-document about section content

const mongoose = require("mongoose")

const aboutSchema = new mongoose.Schema({
  description: { type: String, default: "" }
})

module.exports = mongoose.model("About", aboutSchema)
