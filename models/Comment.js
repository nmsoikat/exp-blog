// post, user, body, replies

const {
  Schema,
  model
} = require("mongoose")

const Post = require("./Post")
const User = require("./User")

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  replies: [{
    //body, user, createdAt
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  }, ],
}, {
  timeStamps: true
})

const Comment = model("Comment", commentSchema)
module.exports = Comment