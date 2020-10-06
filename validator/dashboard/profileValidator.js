const { body } = require("express-validator")
const validator = require("validator")

const validateURL = (value) => {
  if (value) {
    if (!validator.isURL(value)) {
      throw new Error("Please enter valid URL")
    }
  }
  return true
}
module.exports = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("Name can not be empty")
    .isLength({ max: 50 })
    .withMessage("Name maximum 50 characters")
    .trim(),
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title can not be empty")
    .isLength({ max: 100 })
    .withMessage("Title maximum 100 character")
    .trim(),
  body("bio")
    .not()
    .isEmpty()
    .withMessage("Bio can not be empty")
    .isLength({ max: 300 })
    .withMessage("Bio maximum 300 character")
    .trim(),
  body("website").custom(validateURL),
  body("facebook").custom(validateURL),
  body("twitter").custom(validateURL),
  body("github").custom(validateURL),
]
