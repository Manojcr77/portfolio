const express = require("express")
const router  = express.Router()

const {
  getProjects,
  addProject,
  deleteProject,
  getProjectById   // ✅ NEW
} = require("../controllers/projectController")

const { upload } = require("../middleware/upload")
const auth = require("../middleware/auth")

// ✅ GET ALL PROJECTS
router.get("/", getProjects)

// ✅ GET SINGLE PROJECT (VERY IMPORTANT)
router.get("/:id", getProjectById)

// ✅ ADD PROJECT
router.post("/", auth, upload.single("image"), addProject)

// ✅ DELETE PROJECT
router.delete("/:id", auth, deleteProject)

module.exports = router