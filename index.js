const mongoose = require('mongoose');
const async = require ('async');
const {updateTable} = require('./modules/tableWorker.js')

const getPayments = require('./modules/updateData.js')

  
//модели
const Payments = require("./models/Payments.models")

//соединение с бд

const mongoConnect = 'mongodb+srv://....@cluster0.3iir3.mongodb.net/app?retryWrites=true&w=majority'


async function connect() {
    try {
        await mongoose.connect(mongoConnect, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Mongo connect...')
    } catch (e) {
        console.log('Server Error', e.message)
    }
}








 (async () => { 
     
    await connect()
    const series = []
    for (let index = 0; index < 100; index++) {
        series.push(callback => getPayments(callback))
    }
    async.series(series, (errors, results) => console.log(results) )
    
 })()