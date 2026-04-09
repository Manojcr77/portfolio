const Resume = require("../models/Resume")

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })

    await Resume.deleteMany({})
    const resume = await Resume.create({
      path:         req.file.path,          // ✅ Cloudinary URL
      originalName: req.file.originalname
    })
    res.status(201).json(resume)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne()
    if (!resume) return res.status(404).json({ message: "No resume uploaded" })
    res.json(resume)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}