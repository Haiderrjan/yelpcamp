const Review = require('../models/review.js')
const Campground = require('../models/campground');


module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user.id // so it stores the refrenece of who wrote that review to a speicif usder
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'successfuly created a new review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfuly deleted a review')

    res.redirect(`/campgrounds/${id}`)

}