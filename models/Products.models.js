const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
    title: {type: Array, default: [] },
    orderId: {type: Number},
    instagram: {type:String},
    phone: {type:Number}
})


module.exports = mongoose.model("Products", ProductsSchema)