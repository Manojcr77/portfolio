// controllers/aboutController.js — Get / update the About section

const About = require("../models/About")

exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne()
    if (!about) about = await About.create({ description: "" })
    res.json(about)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateAbout = async (req, res) => {
  try {
    let about = await About.findOne()
    if (!about) {
      about = await About.create({ description: req.body.description })
    } else {
      about.description = req.body.description
      await about.save()
    }
    res.json(about)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
