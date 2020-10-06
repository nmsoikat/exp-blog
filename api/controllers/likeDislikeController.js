const Post = require("../../models/Post")

exports.likeGetController = async (req, res, next) => {
  const {
    postId
  } = req.params
  let liked = null

  // Login or not
  if (!req.user) {
    return res.status(403).json({
      error: "Your age not an authenticated user"
    })
  }

  const userId = req.user._id

  try {
    const post = await Post.findById(postId)

    // check disliked then pull
    if (post.dislikes.includes(userId)) {
      await Post.findOneAndUpdate({
        _id: postId
      }, {
        $pull: {
          dislikes: userId
        }
      })
    }
    // check already liked then pull otherwise push
    if (post.likes.includes(userId)) {
      await Post.findOneAndUpdate({
        _id: postId
      }, {
        $pull: {
          likes: userId
        }
      })
      liked = false
    } else {
      // liked
      await Post.findOneAndUpdate({
        _id: postId
      }, {
        $push: {
          likes: userId
        }
      })
      liked = true
    }

    // send response
    const updatedPost = await Post.findById(postId)
    res.status(200).json({
      liked,
      totalLikes: updatedPost.likes.length,
      totalDislikes: updatedPost.dislikes.length,
    })

  } catch (e) {
    console.log(e)
    return res.status(500).json({
      error: "Server Error Occurred",
    })
  }
}

exports.dislikeGetController = async (req, res, next) => {
  const {
    postId
  } = req.params
  let disliked = null

  // Login or not
  if (!req.user) {
    return res.status(403).json({
      error: "Your age not an authenticated user"
    })
  }

  const userId = req.user._id
  // return console.log(userId);


  try {
    // check liked then pull
    const post = await Post.findById(postId)

    // console.log(post.likes);
    // console.log(post.likes.includes(userId));

    if (post.likes.includes(userId)) {
      await Post.findOneAndUpdate({
        _id: postId
      }, {
        $pull: {
          likes: userId
        }
      })
    }

    // check already disliked then pull otherwise push
    if (post.dislikes.includes(userId)) {
      await Post.findOneAndUpdate({
        _id: postId
      }, {
        $pull: {
          dislikes: userId
        }
      })

      disliked = false
    } else {
      await Post.findOneAndUpdate({
        _id: postId
      }, {
        $push: {
          dislikes: userId
        }
      })

      disliked = true
    }

    // send response
    console.log(postId);
    const updatedPost = await Post.findById(postId)

    console.log(disliked);
    console.log(updatedPost.likes.length, updatedPost.dislikes.length);

    res.status(200).json({
      disliked: disliked,
      totalLikes: updatedPost.likes.length,
      totalDislikes: updatedPost.dislikes.length,
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      error: "Server Error Occurred",
    })
  }
}