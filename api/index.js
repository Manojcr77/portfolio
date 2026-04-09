// api/index.js — Vercel serverless entry point
// Vercel routes /api/* to this file

const express       = require("express")
const mongoose      = require("mongoose")
const cors          = require("cors")
const helmet        = require("helmet")
const rateLimit     = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const bcrypt        = require("bcryptjs")
const dns           = require("dns")

dns.setDefaultResultOrder("ipv4first")

// ── Load .env only in local dev (Vercel injects env vars automatically)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: require("path").join(__dirname, "../server/.env") })
}

if (!process.env.MONGO_URI)  throw new Error("MONGO_URI env var is required")
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET env var is required")

const app = express()
const isDev = process.env.NODE_ENV !== "production"

// ── Security headers
app.use(helmet())

// ── CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(isDev ? ["http://localhost:5173", "http://localhost:5174"] : [])
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin && isDev) return cb(null, true)
    if (origin && allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error("Not allowed by CORS"))
  },
  credentials: true
}))

app.use(express.json({ limit: "10kb" }))
app.use(mongoSanitize())

// ── Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,
  message: { message: "Too many requests. Try again in 15 minutes." },
  standardHeaders: true, legacyHeaders: false
})
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 10,
  message: { message: "Too many messages. Try again in an hour." },
  standardHeaders: true, legacyHeaders: false
})
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 200,
  standardHeaders: true, legacyHeaders: false
})

app.use(generalLimiter)

// ── Routes (paths relative to this file)
app.use("/api/auth",     authLimiter,    require("../server/routes/auth"))
app.use("/api/about",                    require("../server/routes/about"))
app.use("/api/skills",                   require("../server/routes/skills"))
app.use("/api/projects",                 require("../server/routes/projects"))
app.use("/api/contact",  contactLimiter, require("../server/routes/contact"))
app.use("/api/resume",                   require("../server/routes/resume"))

// ── Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", ts: Date.now() }))

// ── Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: isDev ? err.message : "Something went wrong"
  })
})

// ── MongoDB — reuse connection across warm invocations (serverless best practice)
let isConnected = false

async function connectDB() {
  if (isConnected) return
  await mongoose.connect(process.env.MONGO_URI)
  isConnected = true
  console.log("✅ MongoDB connected")
  await ensureAdmin()
}

const User = require("../server/models/User")

async function ensureAdmin() {
  try {
    const email    = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    if (!email || !password) return console.warn("⚠️  ADMIN_EMAIL/PASSWORD not set")

    const exists = await User.findOne({ email })
    if (!exists) {
      const hashed = await bcrypt.hash(password, 12)
      await User.create({ name: "Admin", email, password: hashed, role: "admin", isAdmin: true })
      console.log("✅ Admin created:", email)
    }
  } catch (err) {
    console.error("ensureAdmin error:", err.message)
  }
}

// ── Wrap handler to ensure DB is connected before every request
const handler = async (req, res) => {
  await connectDB()
  return app(req, res)
}

module.exports = handler
