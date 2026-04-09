const Project = require("../models/Project")
const { cloudinary } = require("../middleware/upload")

// ===============================
// GET ALL PROJECTS
// ===============================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ===============================
// GET SINGLE PROJECT (NEW)
// ===============================
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ===============================
// ADD PROJECT (ADMIN)
// ===============================
exports.addProject = async (req, res) => {
  try {
    const { title, description, tech, github, live } = req.body

    const image = req.file ? req.file.path : ""

    const project = await Project.create({
      title,
      description,
      tech,
      github,
      live,
      image
    })

    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ===============================
// DELETE PROJECT (ADMIN)
// ===============================
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // delete image from Cloudinary
    if (project.image) {
      const publicId = project.image
        .split("/")
        .slice(-2)
        .join("/")
        .replace(/\.[^/.]+$/, "")

      await cloudinary.uploader.destroy(publicId)
    }

    await Project.findByIdAndDelete(req.params.id)

    res.json({ message: "Project deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}