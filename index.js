if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}



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
const sanitizeV5 = require('./utils/mongoSanitizeV5.js')
const helmet = require('helmet')

const User = require('./models/user')
const campgroundRoutes = require('./routes/campground.js')
const reviewsRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');



app.set('query parser', 'extended');




mongoose.connect('mongodb://127.0.0.1:27017/Yelp-camp');


// to see if the mongo connects 
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected');
})

const sessionConfig = {
    name: 'session',
    secret: 'better-secret',
    resave: false,
     saveUninitialized: true,
     cookies: {
        httpOnly: true,
        // secure: true,
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

app.use(sanitizeV5({ replaceWith: '_' }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqkmnkkb2/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://picsum.photos/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




app.use((req,res,next) => {
    console.log(req.query);
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
    console.log(err);
    const { status = 400 } = err;
    if (!err.message) {
        err.message = "Oh No Something Went Wrong"
    }
    res.status(status).render('error', { err })
})





app.listen(port, () => {
    console.log(`on port ${port}`);
})