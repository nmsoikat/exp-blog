const authRouter = require("./authRouter")
const dashboardRouter = require("./dashboardRouter")
const playgroundRouter = require("../playground/play")
const uploadRouter = require("./uploadRouter")
const postRouter = require("./postRouter")
const explorerRouter = require("./explorerRouter")
const searchResultRouter = require("./searchResultRouter")
const authorRouter = require("./authorRouter")

const apiRouter = require("../api/routers/apiRouter")

const routes = [{
    path: "/auth",
    handler: authRouter,
  },
  {
    path: "/dashboard",
    handler: dashboardRouter,
  },
  {
    path: "/upload",
    handler: uploadRouter,
  },
  {
    path: "/post",
    handler: postRouter,
  },
  {
    path: "/explorer",
    handler: explorerRouter,
  },
  {
    path: "/search",
    handler: searchResultRouter
  },
  {
    path: '/author',
    handler: authorRouter
  },
  {
    path: "/api",
    handler: apiRouter,
  },
  {
    path: "/playground",
    handler: playgroundRouter,
  },
  {
    path: "/",
    handler: (req, res) => {
      res.redirect('/explorer')
    },
  },
]
module.exports = (app) => {
  routes.forEach((r) => {
    if (r.path === "/") {
      app.get(r.path, r.handler)
    } else {
      app.use(r.path, r.handler)
    }
  })
}