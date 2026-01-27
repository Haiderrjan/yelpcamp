const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { string } = require('joi');



const ImageSchema = new Schema ({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200/h_150')
})

const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    image:[ImageSchema],
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
   if (doc) {
    await Review.deleteMany({
        _id: {
            $in: doc.reviews
        }
    })
   }
})



module.exports = mongoose.model('Campground', CampgroundSchema)