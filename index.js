const express = require('express')
const app = express()
const port = 8080;

const mongoose = require('mongoose')

const path = require('path')
const methodOverride = require('method-override')

const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campground.js')
const reviewsRoutes = require('./routes/reviews.js')

const session = require('express-session')
const flash = require('connect-flash')

mongoose.connect('mongodb://127.0.0.1:27017/Yelp-camp');


// to see if the mongo connects 
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected');
})

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, "views"));
app.set('view engine', "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('__method'))
app.use(express.static(path.join(__dirname, 'public')))



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



app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})


app.get('/', (req, res) => {
    res.render('index')
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes)




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