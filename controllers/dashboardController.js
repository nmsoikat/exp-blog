const {
  validationResult
} = require("express-validator")
const Flash = require("../utils/Flash")
const Profile = require("../models/Profile")
const User = require("../models/User")
const Comment = require("../models/Comment")
const ErrorFormatter = require("../utils/validationErrorFormatter")
const Post = require("../models/Post")

module.exports.dashboardGetController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
        userId: req.user._id
      })
      .populate({
        path: 'posts',
        select: 'title thumbnail'
      })
      .populate({
        path: 'bookmarks',
        select: 'title thumbnail'
      })

    if (!profile) {
      return res.redirect("/dashboard/create-profile")
    } else {
      res.render("pages/dashboard/dashboardHome", {
        title: "My Dashboard",
        posts: profile.posts.reverse().slice(0, 3),
        bookmarks: profile.bookmarks.reverse().slice(0, 3),
        flashMessage: Flash.getMessage(req),
      })
    }

  } catch (e) {
    next(e)
  }
}

module.exports.createProfileGetController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      userId: req.user._id
    })
    if (profile) {
      res.redirect("/dashboard/edit-profile")
    }

    return res.render("pages/dashboard/createProfile", {
      title: "Create Profile",
      flashMessage: Flash.getMessage(req),
      errors: {},
      values: {},
    })
  } catch (e) {
    next(e)
  }
}

module.exports.createProfilePostController = async (req, res, next) => {
  const {
    name,
    title,
    bio,
    website,
    twitter,
    facebook,
    github
  } = req.body

  // format error
  const errors = validationResult(req).formatWith(ErrorFormatter)

  //  check error
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/createProfile.ejs", {
      title: "Create Profile",
      flashMessage: Flash.getMessage(req),
      errors: errors.mapped(),
      values: {
        name,
        title,
        bio,
        website,
        twitter,
        facebook,
        github,
      },
    })
  }

  try {
    // create profile
    const profile = new Profile({
      userId: req.user._id,
      name,
      title,
      bio,
      profilePics: req.user.profilePics,
      links: {
        website: website || "",
        twitter: twitter || "",
        facebook: facebook || "",
        github: github || "",
      },
      bookmarks: [],
      posts: [],
    })
    // save profile
    const currentProfile = await profile.save()

    // save profile id to user
    await User.findOneAndUpdate({
      _id: req.user._id
    }, {
      $set: {
        profileId: currentProfile._id
      }
    })

    // flash success message
    req.flash("success", "Profile Created Success!")

    // redirect dashboard
    res.redirect("/dashboard")
  } catch (e) {
    next(e)
  }
}

module.exports.editProfileGetController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      userId: req.user._id
    })
    if (profile) {
      res.render("pages/dashboard/editProfile.ejs", {
        title: "Edit Profile",
        flashMessage: Flash.getMessage(req),
        errors: {},
        profile: profile,
      })
    }
  } catch (e) {
    next(e)
  }
}
module.exports.editProfilePostController = async (req, res, next) => {
  const {
    name,
    title,
    bio,
    website,
    twitter,
    facebook,
    github
  } = req.body
  const errors = validationResult(req).formatWith(ErrorFormatter)

  // check error
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/editProfile", {
      title: "Edit Profile",
      flashMessage: Flash.getMessage(req),
      errors: errors.mapped(),
      profile: {
        name,
        title,
        bio,
        links: {
          website,
          twitter,
          facebook,
          github,
        },
      },
    })
  }
  try {
    // update profile
    const profileData = {
      name,
      title,
      bio,
      links: {
        website,
        twitter,
        facebook,
        github,
      },
    }

    const updatedProfile = await Profile.findOneAndUpdate({
      userId: req.user._id
    }, {
      $set: profileData
    }, {
      new: true
    })

    // success flash
    req.flash("success", "Profile Information Updated Success")

    // redirect same page
    res.render("pages/dashboard/editProfile", {
      title: "Edit Profile",
      flashMessage: Flash.getMessage(req),
      errors: errors.mapped(),
      profile: updatedProfile,
    })
  } catch (err) {
    next(err)
  }
}


module.exports.bookmarkGetController = async (req, res, next) => {

  try {
    const profile = await Profile.findOne({
        userId: req.user.id
      })
      .populate({
        path: 'bookmarks',
        model: 'Post',
        select: 'thumbnail title'
      })
    // console.log(profile);

    res.render('pages/dashboard/bookmark.ejs', {
      title: 'My bookmarks list',
      flashMessage: Flash.getMessage(req),
      bookmarks: profile.bookmarks
    })
  } catch (e) {
    next(e)
  }

}

module.exports.commentGetController = async (req, res, next) => {
  try {
    // current user info
    // current user created post
    // post comment reply

    const profile = await Profile.findOne({
      userId: req.user._id
    })
    const comments = await Comment.find({
        postId: {
          $in: profile.posts
        }
      })
      .populate({
        path: 'postId',
        select: 'title'
      })
      .populate({
        path: 'userId',
        select: 'username profilePics'
      })
      .populate({
        path: 'replies.userId',
        select: 'username profilePics'
      })

    // res.json({
    //   comments
    // })

    res.render('pages/dashboard/comments.ejs', {
      title: 'My Comments',
      flashMessage: Flash.getMessage(req),
      comments
    })

  } catch (e) {
    next(e)
  }
}