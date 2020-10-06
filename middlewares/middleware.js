const express = require("express")
const morgan = require("morgan")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const flash = require("connect-flash")
const { userBindWithRequest } = require("./authMiddleware")
const setLocals = require("./setLocals")
const config = require("config")

// DATABASE CONNECTION STRING
const connectionURI = `mongodb+srv://${config.get("db-username")}:${config.get(
  "db-password"
)}@cluster0.btkty.mongodb.net/${config.get(
  "db-username"
)}?retryWrites=true&w=majority`

// SESSION STORAGE WITH DB
const store = new MongoDBStore({
  uri: connectionURI,
  collection: "mySession1",
  expires: 1000 * 60 * 60 * 2,
})

const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: config.get("secret"),
    resave: false,
    saveUninitialized: false,
    store,
  }),
  flash(),
  userBindWithRequest(),
  setLocals(),
]

module.exports = (app) => {
  middleware.forEach((m) => {
    app.use(m)
  })
}
