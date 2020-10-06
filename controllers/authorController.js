const Flash = require('../utils/Flash')

const Post = require("../models/Post");


exports.authorGetController = async (req, res, next) => {
  const {
    authorId
  } = req.params

  try {
    const post = await Post.findOne({
      author: authorId
    }).populate({
      path: 'author',
      select: 'username email profilePics',
      populate: {
        path: 'profileId',
        populate: {
          path: 'posts'
        }
      }
    })

    // console.log(post);

    res.render('pages/explorer/author.ejs', {
      title: 'Author detail',
      flashMessage: Flash.getMessage(req),
      author: post.author
    })
  } catch (e) {
    console.log(e);
    next(e)
  }
}