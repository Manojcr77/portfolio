const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "portfolio/projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 800, crop: "limit" }]
  }
})

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:        "portfolio/resume",
    resource_type: "raw",
    format:        "pdf",
    public_id:     "resume"
  })
})

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false)
  }
  cb(null, true)
}

const pdfFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"), false)
  }
  cb(null, true)
}

const upload       = multer({ storage: projectStorage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } })
const uploadResume = multer({ storage: resumeStorage,  fileFilter: pdfFilter,   limits: { fileSize: 10 * 1024 * 1024 } })

module.exports = { upload, uploadResume, cloudinary }