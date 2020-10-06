const Post = require('../models/Post');
const Flash = require('../utils/Flash');

exports.searchResultGetController = async (req, res, next) => {
  let term = req.query.term;
  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = 10;

  try {
    const posts = await Post.find({
        $text: {
          $search: term
        }
      })
      .skip(itemPerPage * currentPage - itemPerPage)
      .limit(itemPerPage)

    const totalPost = await Post.countDocuments({
      $text: {
        $search: term
      }
    })

    const totalPage = totalPost / itemPerPage;

    res.render('pages/explorer/search.ejs', {
      title: `Search Result For ${term}`,
      flashMessage: Flash.getMessage(req),
      posts,
      searchTerm: term,
      itemPerPage,
      currentPage,
      totalPage
    })
  } catch (e) {
    alert(e.error)
    console.log(e);
  }
}