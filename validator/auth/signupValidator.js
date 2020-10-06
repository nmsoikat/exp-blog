const { body } = require("express-validator")
const User = require("../../models/User")

module.exports = [
  body("username")
    .isLength({ min: 2, max: 15 })
    .withMessage("Username must be 2 to 15 character")
    .custom(async (username) => {
      const user = await User.findOne({ username })
      if (user) {
        return Promise.reject("Username already used by another user")
      }
      return true
    })
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Please provide our valid email!")
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if (user) {
        return Promise.reject("Email already used")
      }
      return true
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 character"),
  body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword !== req.body.password) {
      throw new Error("Confirm Password Dose Not Match!")
    }
    return true
  }),
]
