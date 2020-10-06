const router = require("express").Router()
const {
  isAuthenticated
} = require("../middlewares/authMiddleware")
const profileValidator = require("../validator/dashboard/profileValidator")
const {
  dashboardGetController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController,
  bookmarkGetController,
  commentGetController
} = require("../controllers/dashboardController")

router.get("/", isAuthenticated, dashboardGetController)

router.get("/create-profile", isAuthenticated, createProfileGetController)
router.post(
  "/create-profile",
  isAuthenticated,
  profileValidator,
  createProfilePostController
)

router.get("/edit-profile", isAuthenticated, editProfileGetController)
router.post(
  "/edit-profile",
  isAuthenticated,
  profileValidator,
  editProfilePostController
)

router.get('/bookmarks', isAuthenticated, bookmarkGetController)

router.get('/comments', isAuthenticated, commentGetController)

module.exports = router