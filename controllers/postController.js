const Flash = require("../utils/Flash")
const readingTime = require("reading-time")

const errorFormatter = require("../utils/validationErrorFormatter")
const { validationResult } = require("express-validator")
const Post = require("../models/Post")
const Profile = require("../models/Profile")

exports.createPostGetController = (req, res, next) => {
  res.render("pages/dashboard/post/createPost.ejs", {
    title: "Create Post",
    flashMessage: Flash.getMessage(req),
    errors: {},
    values: {},
  })
}

exports.createPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body

  const errors = validationResult(req).formatWith(errorFormatter)

  // check validation error
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/post/createPost.ejs", {
      title: "Create Post",
      flashMessage: Flash.getMessage(req),
      errors: errors.mapped(),
      values: {
        title,
        body,
        tags,
      },
    })
  }

  // split tags
  if (tags) {
    const tagArr = tags.split(",")
    tags = tagArr.map((tag) => tag.trim())
  }

  // reading time
  const readTime = readingTime(body).text

  const post = new Post({
    title,
    body,
    author: req.user._id,
    thumbnail: "",
    tags,
    readTime,
    likes: [],
    dislikes: [],
    comments: [],
  })

  if (req.file) {
    post.thumbnail = `/uploads/${req.file.filename}`
  }
  // console.log(req.file.filename) // enctype="multipart/form-data"
  try {
    const currentPost = await post.save()

    await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          posts: currentPost._id,
        },
      }
    )

    req.flash("success", "Post create successfully")

    return res.redirect(`/post/edit/${currentPost._id}`)
  } catch (err) {
    next(err)
  }
}

exports.editPostGetController = async (req, res, next) => {
  const postId = req.params.postId

  try {
    // Post Author Check
    const post = await Post.findOne({
      author: req.user._id,
      _id: postId,
    })

    if (!post) {
      const error = new Error("404 page not found")
      error.status = 404
      throw error
    }

    res.render("pages/dashboard/post/editPost.ejs", {
      title: "Edit your post",
      flashMessage: Flash.getMessage(req),
      errors: {},
      post,
    })
  } catch (e) {
    next(e)
  }
}

exports.editPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body
  const error = validationResult(req).formatWith(errorFormatter)

  // Post Author Check //Check again
  try {
    const post = await Post.findOne({
      author: req.user._id,
      _id: req.params.postId,
    })

    if (!post) {
      const error = new Error("404 page not found")
      error.status = 404
      throw error
    }

    if (!error.isEmpty()) {
      return res.render("pages/dashboard/post/editPost.ejs", {
        title: "Edit Post",
        flashMessage: Flash.getMessage(req),
        errors: error.mapped(),
        post,
      })
    }

    // reading time
    const readTime = readingTime(body).text

    const tagArr = tags.split(",")
    tags = tagArr.map((tag) => tag.trim())

    let thumbnail = post.thumbnail
    if (req.file) {
      thumbnail = `/uploads/${req.file.filename}`
    }

    await Post.findOneAndUpdate(
      { _id: req.params.postId },
      {
        $set: {
          title,
          body,
          tags,
          thumbnail,
          readTime,
        },
      },
      { new: true }
    )

    req.flash("success", "Post Updated")
    res.redirect("/post/edit/" + post._id)
  } catch (e) {
    next(e)
  }
}

exports.deletePostGetController = async (req, res, next) => {
  const { postId } = req.params

  // Authentication check
  const post = await Post.findOne({
    _id: postId,
    author: req.user._id,
  })

  if (!post) {
    const error = new Error("404 Page not found")
    error.status = 404
    throw error
  }

  // delete post
  await Post.findOneAndDelete({ _id: postId })

  // post id remove from profile
  await Profile.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        posts: postId,
      },
    }
  )

  req.flash("success", "Post Deleted Success")

  res.redirect("/post")
}

exports.allPostGetController = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
    res.render("pages/dashboard/post/posts.ejs", {
      title: "My posts",
      flashMessage: Flash.getMessage(req),
      posts,
    })
  } catch (e) {
    next(e)
  }
}
