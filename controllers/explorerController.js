const Flash = require("../utils/Flash")
const Post = require("../models/Post")
const Profile = require("../models/Profile")

const moment = require("moment")

// generate date
const genDate = (days) => {
  const date = moment().subtract(days, "days")
  return date.toDate() // iso formatted date
}

// generate filter object for query
const generateFilterObject = (filter) => {
  let filterObj = {}
  let order = 1 // ascending order

  switch (filter) {
    case "week": {
      filterObj = {
        createdAt: {
          $gt: genDate(7),
        },
      }
      order = -1
      break
    }
    case "month": {
      filterObj = {
        createdAt: {
          $gt: genDate(30),
        },
      }
      order = -1
      break
    }
  }

  return {
    filterObj,
    order,
  }
}

exports.explorerGetController = async (req, res, next) => {
  const filter = req.query.filter || "latest"
  const page = req.query.page

  const {
    filterObj,
    order
  } = generateFilterObject(filter.toLowerCase())

  const currentPage = parseInt(page) || 1
  const itemPerPage = 2

  try {
    const posts = await Post.find(filterObj)
      .sort(order === 1 ? "-createdAt" : "createdAt")
      .populate("author", "username")
      .skip(currentPage * itemPerPage - itemPerPage) // skip from first -> 0, 10, 20, ...
      .limit(itemPerPage) //show from first 10

    const totalPost = await Post.countDocuments(filterObj)
    // .limit(itemPerPage)

    const totalPage = Math.ceil(totalPost / itemPerPage)

    // bookmark
    let bookmarks = []

    if (req.user) {
      const profile = await Profile.findOne({
        userId: req.user._id
      })
      if (profile) {
        bookmarks = profile.bookmarks
      }
    }

    return res.render("pages/explorer/explorer.ejs", {
      title: "Explorer Page",
      flashMessage: Flash.getMessage(req),
      filter,
      posts,
      totalPost,
      totalPage,
      currentPage,
      bookmarks,
    })
  } catch (e) {
    console.log(e)
  }
}

exports.singlePostGetController = async (req, res, next) => {
  const {
    postId
  } = req.params

  try {
    const post = await Post.findById(postId)
      .populate("author", "username profilePics")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
        }
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'replies.userId',
          select: "username profilePics"
        }
      })



    for (let comment of post.comments) {
      for (let reply of comment.replies) {
        if (reply.userId) {
          console.log(reply.userId.username);
        }
      }
    }

    if (!post) {
      const error = new Error()
      error.status = 404
      throw error
    }

    let bookmarks = []
    if (req.user) {
      const profile = await Profile.findOne({
        userId: req.user._id
      })
      if (profile) {
        bookmarks = profile.bookmarks
      }
    }

    res.render("pages/explorer/singlePost.ejs", {
      title: post.title,
      flashMessage: Flash.getMessage(req),
      bookmarks,
      post,
    })
  } catch (e) {
    next(e)
  }
}