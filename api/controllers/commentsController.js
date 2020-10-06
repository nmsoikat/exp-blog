const Comment = require("../../models/Comment")
const Post = require("../../models/Post")

exports.commentPostController = async (req, res, next) => {
  const {
    postId
  } = req.params
  const {
    data
  } = req.body

  // return console.log(postId, data);

  // Login or not
  if (!req.user) {
    return res.status(403).json({
      error: "Your age not an authenticated user"
    })
  }

  try {
    // create comment doc
    const comment = new Comment({
      postId,
      userId: req.user._id,
      body: data,
      replies: [],
    })

    // save comment
    const currentComment = await comment.save()

    // update-push post table commentId
    await Post.findOneAndUpdate({
      _id: postId
    }, {
      $push: {
        comments: currentComment._id,
      },
    })

    // populate comment and send to user
    const commentData = await Comment.findById(currentComment._id).populate({
      path: "userId",
      select: "username profilePics",
    })

    return res.status(201).json({
      commentData
    })

  } catch (e) {
    console.log(e)
    return res.status(500).json({
      error: "Server Error Occurred comment time",
    })
  }
}

exports.repliesPostController = async (req, res, next) => {
  const {
    commentId
  } = req.params
  const {
    body
  } = req.body


  // console.log('ID=', commentId, 'Body=', body);
  // return res.status(200).send({
  //   test: 'test data'
  // })

  // Login or not
  if (!req.user) {
    return res.status(403).json({
      error: "Your age not an authenticated user"
    })
  }

  const reply = {
    userId: req.user._id,
    body,
  }

  try {
    // find current comment
    await Comment.findOneAndUpdate({
      _id: commentId
    }, {
      $push: {
        replies: reply,
      },
    })

    // console.log(currentComment);

    // send response
    res.status(201).json({
      ...reply,
      profilePics: req.user.profilePics,
    })
  } catch (e) {
    console.log(e, 'backend')
    return res.status(500).json({
      error: "Server Error Occurred reply time",
    })
  }
}