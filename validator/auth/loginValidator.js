const { body } = require("express-validator")
// const User = require("../../models/User")
// const bcriptjs = require("bcryptjs")

module.exports = [
  body("email").isEmail().withMessage("Email field can not be empty"),
  // .custom(async (email) => {
  //   const user = await User.findOne({ email })
  //   if (!user) {
  //     return Promise.reject("Login information not match")
  //   }

  //   return true
  // }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password should at least 6 character"),
  // .custom(async (password) => {
  //   const user = await User.findOne({ email })
  //   const match = bcriptjs.compare(password, user.password)
  //   if (!match) {
  //     return Promise.reject("Login information not match")
  //   }
  //   return true
  // }),
]
