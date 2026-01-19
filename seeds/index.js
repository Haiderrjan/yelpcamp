const mongoose = require('mongoose')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')



mongoose.connect('mongodb://127.0.0.1:27017/Yelp-camp');


// to see if the mongo connects 
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected');
})


function sample(seedHelper){
     return seedHelper[Math.floor(Math.random() * seedHelper.length)]
}

async function seedDb() {
    await Campground.deleteMany({})
    for(let i= 0; i<= 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const randomPrice = Math.floor(Math.random() * 20) + 10
        const camp = new Campground ({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta dolore ea sed debitis quam doloremque tempora quas cum corrupti eos, sunt inventore quibusdam maxime officiis excepturi vitae iure delectus explicabo.",
            price: randomPrice
        })
           await camp.save()
    }
}


// using arrow function but i prefer normal function unless needed !

// const seedDB = async() => {
//     await Campground.deleteMany({})
//     for(let i= 0; i<= 50; i++) {
//         const random1000 = Math.floor(Math.random() * 1000)
//         const camp = new Campground ({
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title:`${sample(descriptors)} ${sample(places)}`

//         })
//            await camp.save()
//     }
 
// }



seedDb()
.then(() => {
    mongoose.connection.close()
})

