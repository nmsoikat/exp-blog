const router = require("express").Router()
const Flash = require("../utils/Flash")
const upload = require("../middlewares/uploadMiddleware")

router.get("/play", (req, res, next) => {
  res.render("playground/play.ejs", { flashMessage: {} })
})
router.post("/play", upload.single("my-file"), (req, res, next) => {
  if (req.file) {
    console.log(req.file, "\n", req.body)
  }
  res.redirect("/playground/play")
})

module.exports = router
