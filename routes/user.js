const { Router } = require("express");
const User = require("../models/user");

const router = Router();



router.get('/signup', (req, res) => {
   return res.render('signup')
});

router.get('/signin', (req, res) => {
   return res.render('signin')
});

router.post('/signin',async (req, res) => {
   const user =  {email, password} = req.body;
  await  User.matchPassword(email, password);

    console.log('User', user);
    return res.redirect("/");
});


// fatch the data from user 
router.post('/signup', async (req, res) => {
   const { fullName, email, password } = req.body;
   await User.create({
      fullName,
      email,
      password,
   });
return res.redirect("/");

});

module.exports = router;