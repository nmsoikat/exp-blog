const router = require("express").Router()

const {
  isAuthenticated
} = require("../../middlewares/authMiddleware")
const {
  commentPostController,
  repliesPostController,
} = require("../controllers/commentsController")

const {
  likeGetController,
  dislikeGetController,
} = require("../controllers/likeDislikeController")

const {
  bookmarkGetController
} = require("../controllers/bookmarksController")

router.post("/comments/:postId", isAuthenticated, commentPostController)

router.post(
  "/comments/replies/:commentId",
  isAuthenticated,
  repliesPostController
)

router.get("/like/:postId", isAuthenticated, likeGetController)
router.get("/dislike/:postId", isAuthenticated, dislikeGetController)

router.get("/bookmark/:postId", isAuthenticated, bookmarkGetController)

module.exports = router