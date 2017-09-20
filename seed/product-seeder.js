let Product = require('../models/product')

const mongoose = require('mongoose')
mongoose.connect('localhost:27017/shopping')

let products = [
  new Product({
  imagePath: 'https://vignette.wikia.nocookie.net/callofduty/images/8/8a/CoD4_boxart.png/revision/latest?cb=20110107234635',
  title: 'Call of Duty 4',
  description: 'Best single person shooter!',
  price: 10
}),
  new Product({
    imagePath: 'https://gpstatic.com/acache/32/85/2/uk/packshot-248d06dee3d0a2b332bd6a47e3943f59.jpg',
    title: 'Far Cry 5',
    description: 'Far Cry 5 is a first-person shooter action-adventure video game developed by Ubisoft Montreal.',
    price: 25
  }),
  new Product({
    imagePath: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWcNur?ver=97b9',
    title: 'F1 2017',
    description: 'F1 2017 is a racing video game developed and published by Codemasters. It was released for PlayStation 4, Xbox One.',
    price: 20
  }),
  new Product({
    imagePath: 'https://gpstatic.com/acache/32/85/2/uk/packshot-248d06dee3d0a2b332bd6a47e3943f59.jpg',
    title: 'Far Cry 5',
    description: 'Far Cry 5 is a first-person shooter action-adventure video game developed by Ubisoft Montreal.',
    price: 5
  }),
  new Product({
    imagePath: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWcNur?ver=97b9',
    title: 'F1 2017',
    description: 'F1 2017 is a racing video game developed and published by Codemasters. It was released for PlayStation 4, Xbox One.',
    price: 2
  }),
  new Product({
    imagePath: 'https://vignette.wikia.nocookie.net/callofduty/images/8/8a/CoD4_boxart.png/revision/latest?cb=20110107234635',
    title: 'Call of Duty 4',
    description: 'Best single person shooter!',
    price: 100
  }),
  ]

let done = 0;
for (let i = 0; i < products.length; i++){
  products[i].save(function (err, result) {
    done++
    if(done === products.length){
     exit()
    }
  })
}

function exit () {
  mongoose.disconnect()
}

