const Campground = require('../models/campground')


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id // so it stores the refrenece of who wrote that review to a speicif user
    await campground.save()
    req.flash('success', 'successfuly created a new campground')
    res.redirect(`/campgrounds/${campground.id}`)
}


module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    .populate({
        path:'reviews',
        populate:'author'
    }) // here above just populates the author within the review path which is the model review
    .populate('author')
    console.log(campground);
    if (!campground) {
        req.flash('error', "Can not find the Campground :(")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground, })
}

module.exports.renderEditcampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)

    if (!campground) {
        req.flash('error', "Can not find the Campground :(")
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { campground, })
}


module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const updateCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'successfuly updated a campground')
    res.redirect(`/campgrounds/${updateCampground.id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deleteCampground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'successfuly deleted a new campground')

    res.redirect('/campgrounds')
}