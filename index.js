const express = require('express')
const app = express()
const port = 8080;
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')


const User = require('./models/user')

const campgroundRoutes = require('./routes/campground.js')
const reviewsRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');





mongoose.connect('mongodb://127.0.0.1:27017/Yelp-camp');


// to see if the mongo connects 
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected');
})

const sessionConfig = {
    secret: 'better-secret',
    resave: false,
     saveUninitialized: true,
     cookies: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7 ,
        maxAge: 1000 * 60 * 60 * 24 * 7 
     }
}


app.use(session(sessionConfig))
app.use(flash())

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, "views"));
app.set('view engine', "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('__method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate())) //telling passport to use local Strategy 

passport.serializeUser(User.serializeUser()) // how we serialize a user to a session
passport.deserializeUser(User.deserializeUser()) // how we deserialize a user from a session




app.use((req,res,next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})




app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes)
app.use('/', userRoutes)


app.get('/', (req, res) => {
    res.render('index')
})




// middleware

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    // const {status = 500, message = "Something went wrong"} = err;
    const { status = 400 } = err;
    if (!err.message) {
        err.message = "Oh No Something Went Wrong"
    }
    res.status(status).render('error', { err })
})





app.listen(port, () => {
    console.log(`on port ${port}`);
})