// username, email, password, profileId
const {
  Schema,
  model
} = require("mongoose")

// const Profile = require("./Profile")

const userSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  username: {
    type: String,
    trim: true,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePics: {
    type: String,
    default: "/uploads/default.jpg",
  },
}, {
  timestamps: true,
})

const User = model("User", userSchema)
module.exports = User