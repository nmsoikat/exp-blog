//userId, title, bio, profilePic, links:{},  bookmark:[], postsId:[]

const {
  Schema,
  model
} = require("mongoose")

const Post = require("./Post")
const User = require("./User")

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
  },
  bio: {
    type: String,
    required: true,
    maxlength: 300,
    trim: true,
  },
  profilePics: String,
  links: {
    website: String,
    facebook: String,
    twitter: String,
    github: String,
  },
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: "Post",
  }, ],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "Post",
  }, ],
}, {
  timestamps: true
})

const Profile = model("Profile", profileSchema)
module.exports = Profile