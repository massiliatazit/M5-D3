const express = require("express")
const projectRouter = require("./projects")
const server = express()
const port=3000;
const listEndpoints = require("express-list-endpoints")


const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling.js")

const cors = require("cors")
server.use(cors())
  
server.use(express.json())
server.use("/projects",projectRouter)
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
  })
  const loggerMiddleware = (req, res, next) => {
    console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`)
    next()
  }

server.use(loggerMiddleware)
server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

console.log(listEndpoints(server))
