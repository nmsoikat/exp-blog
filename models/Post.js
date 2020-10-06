//user, title, body, author, thumbnail, tags, readTime, like, dislike, comment

const {
  Schema,
  model
} = require("mongoose")

const User = require("./User")
const Comment = require("./Comment")
const {
  text
} = require("express")

const postSchema = new Schema({
  title: {
    type: String,
    maxlength: 100,
    required: true,
  },
  body: {
    type: String,
    minlength: 200,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thumbnail: String,
  tags: {
    type: [String],
    required: true,
  },
  readTime: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }, ],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }, ],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
  }, ],
}, {
  timestamps: true
})

postSchema.index({
  title: 'text',
  tags: 'text',
  body: 'text'
}, {
  weights: {
    title: 5,
    tags: 5,
    body: 2
  }
})
const Post = model("Post", postSchema)
module.exports = Post