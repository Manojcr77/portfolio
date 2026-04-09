// controllers/skillController.js — CRUD for skills

const Skill = require("../models/Skill")

exports.getSkills = async (req, res) => {
  try {
    res.json(await Skill.find())
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.addSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body)
    res.status(201).json(skill)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteSkill = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id)
    res.json({ message: "Skill deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
