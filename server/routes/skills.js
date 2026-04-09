// routes/skills.js
const router = require("express").Router()
const auth   = require("../middleware/auth")
const { getSkills, addSkill, deleteSkill } = require("../controllers/skillController")

router.get("/",       getSkills)
router.post("/",      auth, addSkill)
router.delete("/:id", auth, deleteSkill)

module.exports = router
