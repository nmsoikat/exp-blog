const Profile = require("../../models/Profile")

exports.bookmarkGetController = async (req, res, next) => {
  const { postId } = req.params

  let bookmarked = null

  // check user logged in or not
  if (!req.user) {
    return res.status(403).json({ error: "You are not authenticated!" })
  }

  const userId = req.user._id

  try {
    const profile = await Profile.findOne({ userId })

    // check already bookmarked then pull otherwise push
    if (profile.bookmarks.includes(postId)) {
      await Profile.findOneAndUpdate(
        { userId: userId },
        { $pull: { bookmarks: postId } }
      )

      bookmarked = false
    } else {
      await Profile.findOneAndUpdate(
        { userId: userId },
        { $push: { bookmarks: postId } }
      )

      bookmarked = true
    }

    res.send({ bookmarked })
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: "Server error occurred" })
  }
}
