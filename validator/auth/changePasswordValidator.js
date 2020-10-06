const User = require('../../models/User')

const {
  body
} = require('express-validator')

const bcrypt = require('bcryptjs')


module.exports = [
  body('oldPassword')
  .not()
  .isEmpty()
  .withMessage("Password filed can not be empty")
  .custom(async (oldPassword, {
    req
  }) => {
    try {
      const user = await User.findOne({
        _id: req.user._id
      })

      const match = await bcrypt.compare(oldPassword, user.password)
      if (!match) {
        return Promise.reject("Invalid Old Password")
        // throw new Error("Invalid Password")
      }

      return true;

    } catch (e) {
      return e.message
    }
  }),
  body('newPassword')
  .not().isEmpty().withMessage("Password filed can not be empty"),
  body('confirmPassword')
  .not().isEmpty().withMessage("Password filed can not be empty")
  .custom((confirmPassword, {
    req
  }) => {
    if (confirmPassword !== req.body.newPassword) {
      throw new Error("Confirm password dose not matched !!")
    }

    return true;
  }),

]