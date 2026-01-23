const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground,isAuthor } = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js');


router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id', catchAsync(campgrounds.showCampground))


router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditcampground))

router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))

router.delete('/:id', isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))



// an different way to structure your code but the one above is more readable :)
// only adding here to show but keeping the top way more readable unless more of
// routes get added.



// router.route('/')
// .get(catchAsync(campgrounds.index))
// .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// router.route('/:id/edit')
// .get(isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditcampground))


// router.route('/:id')
// .get(catchAsync(campgrounds.showCampground))
// .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
// .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))






module.exports = router;