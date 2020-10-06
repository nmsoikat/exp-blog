const router = require("express").Router()

const { isAuthenticated } = require("../middlewares/authMiddleware")
const uploadMiddleware = require("../middlewares/uploadMiddleware")

const {
  uploadProfilePicsController,
  deleteProfilePicsController,
  uploadPostImageController,
} = require("../controllers/uploadController")

router.post(
  "/userProfilePics",
  isAuthenticated,
  uploadMiddleware.single("profilePics"),
  uploadProfilePicsController
)
router.delete("/userProfilePics", isAuthenticated, deleteProfilePicsController)

// post image upload
router.post(
  "/postImage",
  isAuthenticated,
  uploadMiddleware.single("post-image"),
  uploadPostImageController
)

module.exports = router
