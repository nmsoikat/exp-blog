const UserModel = require("../models/User")
const bcriptjs = require("bcryptjs")
const {
  validationResult
} = require("express-validator")
const errorFormatter = require("../utils/validationErrorFormatter")
const Flash = require("../utils/Flash")
const User = require("../models/User")

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", {
    title: "Signup Page",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  })
}
exports.signupPostController = async (req, res, next) => {
  // console.log(req.body)
  const {
    username,
    email,
    password
  } = req.body

  const errors = validationResult(req).formatWith(errorFormatter)
  if (!errors.isEmpty()) {
    req.flash("fail", "Please check the form")

    // return console.log(errors.mapped())
    return res.render("pages/auth/signup", {
      title: "Signup Page",
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
      flashMessage: Flash.getMessage(req),
    })
  }

  try {
    const hashPassword = await bcriptjs.hash(password, 11)

    const user = new UserModel({
      username,
      email,
      password: hashPassword,
    })

    // const saveUser = await user.save()
    // console.log(saveUser)
    await user.save()
    req.flash("success", "Account create complete")
  } catch (err) {
    console.log("Submit failed!")
    console.log(err)
    return next(err)
  }

  res.redirect("/dashboard")
}

exports.loginGetController = (req, res, next) => {
  // console.log(req.session.isLoggedIn, req.session.user)

  res.render("pages/auth/login", {
    title: "Login user",
    error: {},
    flashMessage: Flash.getMessage(req),
  })
}
exports.loginPostController = async (req, res, next) => {
  const {
    email,
    password
  } = req.body
  // console.log(req.body)

  const errors = validationResult(req).formatWith(errorFormatter)
  if (!errors.isEmpty()) {
    req.flash("fail", "Please check the form")
    res.render("pages/auth/login", {
      title: "Login user",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
    })

    return next()
  }

  try {
    // check email with database
    const user = await UserModel.findOne({
      email
    })
    // console.log(user)
    if (!user) {
      // res.json({ failed: "Invalid Credentials" })
      req.flash("fail", "Please provide your valid credentials")
      return res.redirect("/auth/login")
    } else {
      // match password
      const match = await bcriptjs.compare(password, user.password)
      if (!match) {
        // res.json({ failed: "Invalid Credential" })
        req.flash("fail", "Please provide your valid credentials")
        return res.redirect("/auth/login")
      }
    }

    // login success
    // res.setHeader("Set-Cookie", "loggedIn=true")

    // set session and save
    req.session.isLoggedIn = true
    req.session.user = user
    req.session.save((err) => {
      if (err) {
        console.log(err)
        return next()
      }

      // if session save time no error
      req.flash("success", "Login success")
      return res.redirect("/dashboard")
    })
  } catch (e) {
    console.log("login in failed")
    console.log(e)
    next(e)
  }
}

exports.logoutController = (req, res, next) => {
  req.flash("success", "Logout success")

  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      return next()
    }

    return res.redirect("/auth/login")
  })
}


exports.changePasswordGetController = (req, res, next) => {
  res.render('pages/dashboard/changePassword.ejs', {
    title: 'Change Password',
    errors: {},
    flashMessage: Flash.getMessage(req)
  })
}

exports.changePasswordPostController = async (req, res, next) => {
  const {
    newPassword
  } = req.body;

  const errors = validationResult(req).formatWith(errorFormatter)

  if (!errors.isEmpty()) {

    req.flash('fail', 'Please check your form')

    return res.render('pages/dashboard/changePassword.ejs', {
      title: 'Change Password Failed',
      errors: errors.mapped(),
      flashMessage: Flash.getMessage(req)
    })
  }

  try {
    const hashPassword = await bcriptjs.hash(newPassword, 11)

    await User.findOneAndUpdate({
      _id: req.user._id
    }, {
      $set: {
        password: hashPassword
      }
    })

    req.flash('success', 'Password Changed success')

    return res.redirect('/auth/change-password')
  } catch (e) {
    next(e)
  }

}


// exports.forgetPasswordGetController = (req, res, next) => {
//   res.render('pages/auth/forgetPassword.ejs', {
//     title: 'Stupid',
//     flashMessage: Flash.getMessage(req)
//   })
// }

// exports.forgetPasswordPostController = async (req, res, next) => {

//   try {
//     const hashPassword = await bcriptjs.hash(req.body.newPassword, 11)
//     await User.findOneAndUpdate({
//       _id: "5f462ac744d35612a0364862"
//     }, {
//       password: hashPassword
//     })

//     req.flash('success', 'change password success')
//     res.redirect('/auth/login')
//   } catch (e) {
//     next(e)
//   }

// }




/*-------------------
signup get controller
signup post controller

login get controller
login post controller

logout controller
*/