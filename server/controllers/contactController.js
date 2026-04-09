// controllers/contactController.js — Handles contact form submissions

const Contact = require("../models/Contact")

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message)
      return res.status(400).json({ message: "All fields required" })

    const contact = await Contact.create({ name, email, message })
    res.status(201).json({ message: "Message sent!", contact })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getMessages = async (req, res) => {
  try {
    res.json(await Contact.find().sort({ createdAt: -1 }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
