const router = require("express").Router()
const { login, adminLogin } = require("../controllers/authController")

router.post("/login", login)
router.post("/admin-login", adminLogin)  // ✅ add this line

module.exports = router