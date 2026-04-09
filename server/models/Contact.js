// models/Contact.js — Stores messages from the contact form

const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Contact", contactSchema)
