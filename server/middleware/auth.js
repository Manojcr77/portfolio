const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized — no token" })
  }

  const token = header.split(" ")[1]

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not set")
    return res.status(500).json({ message: "Server misconfiguration" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: "Unauthorized — invalid token" })
  }
}

module.exports = auth
