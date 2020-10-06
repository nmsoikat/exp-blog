const User = require("../models/User")

module.exports.userBindWithRequest = () => {
  return async (req, res, next) => {
    //is logged In
    if (!req.session.isLoggedIn) {
      return next()
    }

    try {
      const user = await User.findById(req.session.user._id)
      req.user = user
      return next()
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
}

module.exports.isAuthenticated = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/auth/login")
  }

  next()
}

module.exports.isUnauthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/dashboard")
  }
  next()
}
