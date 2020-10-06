require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const flash = require("connect-flash")
const config = require("config")
const chalk = require("chalk") // change console color

// debug
const testConsole = require("debug")("app:test")
const dbConsole = require("debug")("app:db")
testConsole("test debug.. console")
dbConsole("This is db error log")

// Import Route
const authRouter = require("./routers/authRouter")
const dashboardRouter = require("./routers/dashboardRouter")

// Import Middleware
const { userBindWithRequest } = require("./middlewares/middleware")
const setLocals = require("./middlewares/setLocals")

// playground
// const playgroundRouter = require("./playground/validator")

const app = express()
// testDB:1234
// const DB_NAME = process.env.DB_NAME
// const DB_PASSWORD = process.env.DB_PASSWORD

// mongodb+srv://testDB:1234@cluster0.btkty.mongodb.net/testDB?retryWrites=true&w=majority
// const connectionURI = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.btkty.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const connectionURI = `mongodb+srv://${config.get("db-username")}:${config.get(
  "db-password"
)}@cluster0.btkty.mongodb.net/${config.get(
  "db-username"
)}?retryWrites=true&w=majority`

// console.log(app.get("env")) // get current environment  // NODE_ENV
// console.log(process.env.NODE_ENV) // get node environment

// const config = require("./config/config")
// if (process.env.NODE_ENV.toLowerCase() == "development") {
//   console.log(config.dev.name)
// } else {
//   console.log(config.prod.name)
// }
// console.log(app.get("env"))

console.log(app.get("env"))
console.log(config.get("name"))
console.log(config.get("common")) // if not have development.json then default is work
console.log(config.get("contacts.email"))

const store = new MongoDBStore({
  uri: connectionURI,
  collection: "mySession1",
  expires: 1000 * 60 * 60 * 2,
})

// setup view engine
app.set("view engine", "ejs")
app.set("views", "views")

// all middleware
const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    // secret: process.env.DB_SECRET_KEY || "SECRET_KEY",
    secret: config.get("secret"),
    resave: false,
    saveUninitialized: false,
    // cookies: {
    //   maxAge: 1000 * 60 * 60 * 1,
    // },
    store,
  }),
  userBindWithRequest(),
  setLocals(),
  flash(),
]
app.use(middleware)

// playground
// app.use("/playground", playgroundRouter)

// group router
app.use("/auth", authRouter)
app.use("/dashboard", dashboardRouter)

app.get("/", (req, res) => {
  res.render("pages/home", {
    title: "Home",
    flashMessage: {},
  })
})

const PORT = process.env.PORT || 8080
mongoose
  .connect(connectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(chalk.green.inverse("Connection Success"))
      console.log(
        chalk.keyword("yellow").inverse(`Server is running on port:${PORT}`)
      )
    })
  })
  .catch((err) => {
    console.log("Connection Failed")
    return console.log("Error" + err)
  })
