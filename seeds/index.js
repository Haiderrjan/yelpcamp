const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')



mongoose.connect('mongodb://127.0.0.1:27017/Yelp-camp');

'https://picsum.photos/400?random=0.39469293826108454'
// 'https://picsum.photos/400?random=0.5474886851779274'
// 'https://picsum.photos/400?random=0.47429939484201344'

// to see if the mongo connects 
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected');
})


function sample(seedHelper) {
    return seedHelper[Math.floor(Math.random() * seedHelper.length)]
}

async function seedDb() {
    await Campground.deleteMany({})
    for (let i = 0; i <= 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const randomPrice = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '6970b9f1463e326b235743eb',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta dolore ea sed debitis quam doloremque tempora quas cum corrupti eos, sunt inventore quibusdam maxime officiis excepturi vitae iure delectus explicabo.",
            price: randomPrice,
            image: [
                {
                    url: 'https://res.cloudinary.com/dqkmnkkb2/image/upload/v1769530674/Yelpcamp/mbeawkox7zqqknuhk2xb.webp',
                    filename: 'Yelpcamp/mbeawkox7zqqknuhk2xb',
                },
                {
                    url: 'https://res.cloudinary.com/dqkmnkkb2/image/upload/v1769530674/Yelpcamp/ane2zesjkg2vnn35yumf.jpg',
                    filename: 'Yelpcamp/ane2zesjkg2vnn35yumf',
                }
            ]
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

