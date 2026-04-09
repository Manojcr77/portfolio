const router = require("express").Router()
const auth   = require("../middleware/auth")
const { uploadResume }          = require("../middleware/upload")              // ✅ multer instance
const { uploadResume: upload, getResume } = require("../controllers/resumeController")  // ✅ controller fn

router.get("/",  getResume)
router.post("/", auth, uploadResume.single("resume"), upload)  // ✅ middleware → controller

module.exports = router