const mongoose = require('mongoose')

const PaymentsSchema = new mongoose.Schema({

    nameClient: {type: String}, 
    counterId: {type: Number},
    orderId: {type: Number},
    uniqueId: {type: Number},
    date: {type: String},
    //из второй транзакции
    cart: {type: Array , default: []},
    client_phone: {type: String},
    client_email: {type: String},
    
    
})


module.exports = mongoose.model("Payments", PaymentsSchema)