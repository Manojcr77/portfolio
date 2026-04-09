const router = require("express").Router()
const auth   = require("../middleware/auth")
const { sendMessage, getMessages, deleteMessage } = require("../controllers/contactController")

router.post("/",     sendMessage)           // public — anyone can send
router.get("/",      auth, getMessages)     // admin only
router.delete("/:id", auth, deleteMessage)  // admin only

module.exports = router
