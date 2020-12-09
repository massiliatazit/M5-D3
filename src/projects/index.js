const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")
const router = express.Router()
const {check,validationResult}=require("express-validator")
const { userInfo } = require("os")
router.get("/",(req,res)=>{

    const projectFilePath =path.join(__dirname,"projects.json")
    const filebuff = fs.readFileSync(projectFilePath)
    const fileAsString = filebuff.toString()
    const projectsArray = JSON.parse(fileAsString)
    res.send(projectsArray)
})

const readFile = (fileName)=>{
    const buffer = fs.readFileSync(path.join(__dirname,fileName))
    const fileContent = buffer.toString()
    return JSON.parse(fileContent)
}
router.get("/:id",(req,res,next)=>{
   try{
    console.log("here generated id",req.params.id)
    const projectsContent = readFile("projects.json")
    const project = projectsContent.filter(proj=>proj.ID === req.params.id)
    if(project.length>0){
        res.send(project)

    }else{
        const err = new Error()
        err.httpStatus.Code=404
        next(err)
    }
    
   }catch(error){next(error)}
})


router.get("/",(req,res,next)=>{

   try{
    const projectsContent = readFile("projects.json")
    console.log(req.query)
    if (req.query && req.query.name) {
        const filterprojects = projectsContent.filter(
          proj =>
            proj.hasOwnProperty("name") &&
            proj.name.toLowerCase() === req.query.name.toLowerCase()
        )
        res.send(filterprojects)
      } else {
        res.send(projectsContent)
      }
   }catch(err){next(err)}
    })


    router.post("/", (req, res,next) => {
        try{
            const projectsContent = readFile("projects.json")
        const create_new_proj = {
          ...req.body,
          ID: uniqid(),
          modifiedAt: new Date(),
        }
      
        projectsContent.push(create_new_proj)
      
        fs.writeFileSync(
          path.join(__dirname, "projects.json"),
          JSON.stringify(projectsContent)
        )
      
        res.status(201).send({ id: create_new_proj.ID })
        res.status(200).send({name:create_new_proj.name})
        res.status(200).send({discription:create_new_proj.discription})
        res.status(200).send({creationdate:create_new_proj.creationdate})
        res.status(200).send({RepoURL:create_new_proj.RepoURL})
        res.send.status(200).send({LiveURL:create_new_proj.LiveURL})
        }catch(error){
            next(error)
        }
      })
      router.put("/:id",(req,res)=>{
          const projectsContent=readFile("projects.json")
          const newProj = projectsContent.filter(project=>project.ID!==req.params.id)

         const modifiedProject = {

            ...req.body,
            ID:req.params.id,
            modifiedAt:new Date(),
         }
         newProj.push(modifiedProject)
         fs.writeFileSync(path.join(__dirname,"projects.json"),JSON.stringify(newproj))

         res.send({id:modifiedProject.ID})

      })

      router.post("/", [check("name").exists().withMessage("name is a mandatory field"),
check("description").exists().withMessage("Needs a description"),
check("repoUrl").exists().isURL().withMessage("has to be a valid repoUrl"),
check("liveUrl").exists().isURL().withMessage("has to be a valid Live URL"), ], (req, res) => {
  try{

    const errors = validationResult(req)

    if (!errors.isEmpty()){
      const err = new Error()
      err.httpStatusCode = 400
      err.message = errors
      next(err)
    }else {

    const projectDB = readFile("projects.json")
    const newproject = {
      ...req.body,
      ID: uniqid(),
      modifiedAt: new Date(),
    }
  
    projectDB.push(newproject)
  
    fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(projectDB))
  
    res.status(201).send({ id: newproject.ID })
}
  }catch(error){
    next(error)
  }
})

module.exports=router

