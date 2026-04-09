// routes/about.js
const router = require("express").Router()
const auth   = require("../middleware/auth")
const { getAbout, updateAbout } = require("../controllers/aboutController")

router.get("/",  getAbout)
router.put("/",  auth, updateAbout)

module.exports = router
