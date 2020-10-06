const { body } = require("express-validator")

const cheerio = require("cheerio")

module.exports = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title can not be empty!")
    .isLength({ max: 100 }),

  body("body")
    .not()
    .isEmpty()
    .withMessage("Post body can not be empty!")
    .custom((value) => {
      const data = cheerio.load(value)
      const text = data.text()

      if (text.length < 200) {
        throw new Error("Body minimum 200 character")
      }
      if (text.length > 5000) {
        throw new Error("Body can not be greater than 5000 character")
      }

      return true
    }),

  body("tags").not().isEmpty().withMessage("Tags can to be empty!!"),
]
