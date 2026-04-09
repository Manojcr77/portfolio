/**
 * seed.js — Run once to create the admin user
 * Usage: node seed.js
 */
require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt   = require("bcryptjs")
const User     = require("./models/User")

async function seed() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set in .env")

  await mongoose.connect(process.env.MONGO_URI)

  const email    = process.env.ADMIN_EMAIL    || "admin@manoj.dev"
  const password = process.env.ADMIN_PASSWORD

  if (!password) throw new Error("ADMIN_PASSWORD not set in .env")

  const existing = await User.findOne({ email })
  if (existing) {
    console.log("ℹ️  Admin already exists:", email)
    await mongoose.disconnect()
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  await User.create({ name: "Admin", email, password: hashed, role: "admin", isAdmin: true })

  console.log("✅ Admin created")
  console.log("   Email:", email)

  await mongoose.disconnect()
}

seed().catch(err => { console.error("❌", err.message); process.exit(1) })
