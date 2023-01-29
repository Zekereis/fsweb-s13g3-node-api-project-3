const User = require("../users/users-model")

function logger(req, res, next) {
  const method = req.method
  const url = req.originalUrl
  const timestamp = new Date().toLocaleString()
  console.log("[",timestamp,"]",method,"--",url)
  
  next()
}

async function validateUserId(req, res, next) {
  try{
    const user = await User.getById(req.params.id)
    if(!user){
      res.status(404).json({
        message: "not found"
      })
    }else{
      req.user = user
      next()
    }
  }catch(err){
    res.status(500).json({
      message: "işlem yapılamadı"
    })
  }
}

function validateUser(req, res, next) {
  const {name} = req.body
  if(!name){
    res.status(404).json({
      message: "gerekli name alanı eksik"
    })
  }else{
    req.name= name
    next()
  }
}

function validatePost(req, res, next) {
  const {text} = req.body
  if(!text) {
    res.status(400).json({
      message: "gerekli text alanı eksik"
    })
  }else{
    req.text = text
    next()
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın


module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}