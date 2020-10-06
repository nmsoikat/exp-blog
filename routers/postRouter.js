const router = require("express").Router()

const { isAuthenticated } = require("../middlewares/authMiddleware")
const postValidator = require("../validator/dashboard/post/postValidator")
const uploadMiddleware = require("../middlewares/uploadMiddleware")
const {
  createPostGetController,
  createPostPostController,
  editPostGetController,
  editPostPostController,
  deletePostGetController,
  allPostGetController,
} = require("../controllers/postController")

router.get("/create", isAuthenticated, createPostGetController)
router.post(
  "/create",
  isAuthenticated,
  uploadMiddleware.single("post-thumbnail"),
  postValidator,
  createPostPostController
)

router.get("/edit/:postId", isAuthenticated, editPostGetController)
router.post(
  "/edit/:postId",
  isAuthenticated,
  uploadMiddleware.single("post-thumbnail"),
  postValidator,
  editPostPostController
)

router.get("/delete/:postId", isAuthenticated, deletePostGetController)

router.get("/", isAuthenticated, allPostGetController)

module.exports = router
