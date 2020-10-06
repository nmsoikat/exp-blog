const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },
  filename: (req, file, cb) => {
    const uniqueName = file.fieldname + "-" + Date.now() + file.originalname
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: 1024 * 1024 * 5,
  fileFilter: (req, file, cb) => {
    const type = /jpeg|jpg|png|gif/
    const extName = type.test(path.extname(file.originalname.toLowerCase()))
    const mimeType = type.test(file.mimetype)

    if (extName && mimeType) {
      cb(null, true)
    } else {
      cb(new Error("Supported only image"))
    }
  },
})

module.exports = upload
