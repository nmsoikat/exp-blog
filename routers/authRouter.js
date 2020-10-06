const router = require("express").Router()
const signupValidator = require("../validator/auth/signupValidator")
const loginValidator = require("../validator/auth/loginValidator")
const changePasswordValidator = require("../validator/auth/changePasswordValidator")

const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
  changePasswordGetController,
  changePasswordPostController,
  forgetPasswordGetController,
  forgetPasswordPostController
} = require("../controllers/authController")

const {
  isUnauthenticated,
  isAuthenticated
} = require("../middlewares/authMiddleware")

router.get("/signup", isUnauthenticated, signupGetController)
router.post("/signup", isUnauthenticated, signupValidator, signupPostController)

router.get("/login", isUnauthenticated, loginGetController)
router.post("/login", isUnauthenticated, loginValidator, loginPostController)


router.get("/change-password", isAuthenticated, changePasswordGetController)
router.post("/change-password", isAuthenticated, changePasswordValidator, changePasswordPostController)

router.get("/logout", logoutController)

// router.get("/forget-password", forgetPasswordGetController)
// router.post("/forget-password", forgetPasswordPostController)

module.exports = router