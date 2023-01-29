const express = require('express');
const {logger,
   validatePost,
   validateUser,
   validateUserId} 
   = require("../middleware/middleware")
// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
const User = require("./users-model")
const Post = require("../posts/posts-model")

// ara yazılım fonksiyonları da gereklidir

const router = express.Router();

router.get('/', (req, res,next) => {
  User.get()
  .then(users => {
    res.json(users)
  })
  .catch(next)
});

router.get('/:id',validateUserId, (req, res ,next) => {
  res.json(req.user)
  next()
});

router.post('/', validateUser,(req, res,next) => {
  User.insert({name: req.name})
  .then(newUser => {
    res.status(200).json(newUser)
  })
  .catch(next)
});

router.put('/:id',validateUserId,validateUser, async (req, res, next) => {
  try{
    await User.update(req.params.id, {name: req.name})
    const updatedUser = await User.getById(req.params.id)
    res.json(updatedUser)
  }catch(err){
    next(err)
  }
});

router.delete('/:id',validateUserId,async (req, res) => {
  try{
    await User.remove(req.params.id)
    res.json(req.user)
  }catch(err){
    next(err)
  }
});

router.get('/:id/posts', validateUserId,async(req, res,next) => {
  try{
    const result = await User.getUserPosts(req.params.id)
    res.json(result)
  }catch(err){
    next(err)
  }
});

router.post('/:id/posts',validateUserId,validatePost,async (req, res) => {
  try{
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text
    })
    res.json(result)
  }catch(err){
  next(err)
  }
});

router.use((err,req,res,next) => {
  res.status(err.status || 500).json({
    customMessage: "birseyler yanlıs gitti",
    message: err.message
  })
})

// routerı dışa aktarmayı unutmayın

module.exports = router