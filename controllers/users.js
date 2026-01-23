const User = require('../models/user');


module.exports.renderUserForm = (req, res) => {
    res.render('users/register')
}


module.exports.registerUser = async (req, res,) => {

    try {
        const { email, username, password, } = req.body
        const user = new User({ email, username })
        await User.register(user, password)
        req.flash('success', "thanks for registering please log in again")
        res.redirect('/login')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req,res) => {
    req.flash('success', 'welcome back')
   const redirectURL =  res.locals.returnTo  || '/campgrounds'
    res.redirect(redirectURL)
}

module.exports.logoutUser = (req,res) =>{
 req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

