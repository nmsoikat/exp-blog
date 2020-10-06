const fs = require("fs")
const User = require("../models/User")
const Profile = require("../models/Profile")

module.exports.uploadProfilePicsController = async (req, res, next) => {
  if (req.file) {
    try {
      const profile = await Profile.findOne({ userId: req.user._id })
      const profilePics = `/uploads/${req.file.filename}`

      // when update then delete previous img automatically and then update
      if (profile.profilePics !== "/uploads/default.jpg") {
        const currentProfilePics = req.user.profilePics
        fs.unlink(`public${currentProfilePics}`, (err) => {
          if (err) next(err)
        })
      }

      if (profile) {
        await Profile.findOneAndUpdate(
          { userId: req.user._id },
          {
            $set: {
              profilePics,
            },
          }
        )
      }

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            profilePics,
          },
        }
      )

      // uploaded
      return res.status(200).json({
        profilePics,
      })
    } catch (e) {
      res.status(500).json({
        profilePics: req.user.profilePics,
      })
    }
  } else {
    res.status(500).json({
      profilePics: req.user.profilePics,
    })
  }
}

module.exports.deleteProfilePicsController = (req, res, next) => {
  try {
    const defaultProfilePics = "/uploads/default.jpg"
    const currentProfilePics = req.user.profilePics

    fs.unlink(`public${currentProfilePics}`, async () => {
      const profile = await Profile.findOne({ userId: req.user._id })

      if (profile) {
        await Profile.findOneAndUpdate(
          { userId: req.user._id },
          {
            $set: {
              profilePics: defaultProfilePics,
            },
          }
        )
      }

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            profilePics: defaultProfilePics,
          },
        }
      )
    })

    res.status(200).json({ profilePics: defaultProfilePics })
  } catch (err) {
    // console.log(err)
    res.status(500).json({
      message: "image can not deleted",
    })
  }
}

module.exports.uploadPostImageController = (req, res, next) => {
  if (req.file) {
    res.status(200).json({ imgUrl: `/uploads/${req.file.filename}` })
  } else {
    res.status(500).json({ message: "Server Error" })
  }
}
