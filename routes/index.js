var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const upload = require("./multer");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res ) {
  res.render('index');
});
router.get('/login', function(req, res ) {
  res.render('login' , {error : req.flash('error')});
});

router.get('/feed', function(req, res ) {
  res.render('feed');
});
router.post('/upload',isLoggedIn ,upload.single("file"),async function(req, res ) {
   if(!req.file){
    return res.status(404).send("no files were given");
   }

  //  jo bhi file upload hui hai use save kro as a post and uska postid user ko do and post ko user id do
  //  res.send("file uploaded sucessfully");
   const user  = await  userModel.findOne({
     username: req.session.passport.user
   });
   const post = await postModel.create({
     image : req.file.filename,
     postText: req.body.filecaption,
     user :user._id
   });

    user.posts.push(post._id);
    await user.save();
   res.send("done");

});

router.get('/profile' , isLoggedIn , async (req,res , next)=>{
  const user = await userModel.findOne({
    username : req.session.passport.user
    // jb aap login kr lete ho kya hota hai req.sesion.passport.user me tumhara username aa jaata hai
  }).populate("posts")
  console.log(user.posts);
  res.render('profile' , {user});
})

router.post("/register", (req, res) => {
  const { username, email , fullname } = req.body;
  const userData = new userModel({username , email , fullname});

  userModel.register(userData , req.body.password)
  .then(()=>{
    passport.authenticate("local" ) (req , res , ()=>{
      res.redirect("/profile") ;
    })
  })

})
router.post("/login", passport.authenticate("local" , {
  successRedirect: "/profile" ,
  failureRedirect :"/login",
  failureFlash : true
}), (req , res) =>{

});

router.get("/logout" , (req , res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req , res , next){
   if(req.isAuthenticated()) return next();
   res.redirect("/login");
}



module.exports = router;
