const express = require('express')
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas.js')



const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}




router.get('/', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))




router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})


router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'successfuly created a new campground')
    res.redirect(`/campgrounds/${campground.id}`)
}))


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews')

    if (!campground) {
        req.flash('error', "Can not find the Campground :(")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground,})
}))



router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    
     if (!campground) {
        req.flash('error', "Can not find the Campground :(")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground, })
}))


router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const updateCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'successfuly updated a campground')
    res.redirect(`/campgrounds/${updateCampground.id}`)
}))


router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleteCampground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'successfuly deleted a new campground')

    res.redirect('/campgrounds')
}))

module.exports = router;