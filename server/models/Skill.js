// models/Skill.js — Individual skill entry

const mongoose = require("mongoose")

const skillSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  level:   { type: Number, default: 80 },   // percentage 0-100
  icon:    { type: String, default: "" },
  category:{ type: String, default: "General" }
})

module.exports = mongoose.model("Skill", skillSchema)
