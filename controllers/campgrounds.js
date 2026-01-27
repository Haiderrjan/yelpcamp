const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary');



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {

    const campground = new Campground(req.body.campground)
    // we made in models images to be an array so we will map to ad
    // made use of images.array as to add multiple so we need to map if we have more 
    // than one 
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))

    // so it stores the refrenece of who wrote that review to a speicif user
    campground.author = req.user._id
    await campground.save()
    console.log(campground);
    req.flash('success', 'successfuly created a new campground')
    res.redirect(`/campgrounds/${campground.id}`)
}


module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: 'author'
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
  
    // updates everything in the form and saves
    const updateCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    // seperate updates the images if more images are added and pushes it to array and saves
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.image.push(...img)

    // delete images from the edit form checkbox 
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
       await campground.updateOne({
            $pull: { image: { filename: { $in: req.body.deleteImages } } }
        })
        console.log(campground);
    }



    await campground.save()
    req.flash('success', 'successfuly updated a campground')
    res.redirect(`/campgrounds/${updateCampground.id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deleteCampground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'successfuly deleted a new campground')

    res.redirect('/campgrounds')
}