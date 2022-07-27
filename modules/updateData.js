const axios = require('axios');
const mongoose = require('mongoose');
const { getDates } = require('./index.js');
const async = require ('async');
const {updateTable} = require('./tableWorker.js')

const username = "admin";
const password = "1525fcf00dda";
const authToken = Buffer.from(`${username}:${password}`).toString("base64");


//модели
const Payments = require("../models/Payments.models")

const instance = axios.create({
    baseURL: 'https://bbtuning2.server.paykeeper.ru',
    headers: {Authorization: `Basic ${authToken}`}
  });




//get all payments

let getPayments = async (callback) => {
    console.log('новый круг')
    let {startDate, currentDate} = getDates(15)

    const response = await instance.get(`/info/payments/bydate/?limit=10000&start=${startDate}&end=${currentDate}&from=0&status[]=success&payment_system_id[]=52`);     
    //const response = await instance.get(`/info/payments/bydatecount/?start=${startDate}&end=${currentDate}&status[]=success&status[]=canceled&status[]=failed`);          

    let data = response.data || []
   console.log(data);
          
    await Promise.all(data.map(async item => {
        let {id, unique_id, success_datetime, orderid, clientid} = item;
        const check = await Payments.findOne({ uniqueId: unique_id });
        if(check) return;
        let {result, client_email, client_phone, success} = await getProducts(id)
        
        await Payments.create({
            counterId: id, 
            uniqueId: unique_id, 
            date: success_datetime, 
            orderId: orderid, 
            nameClient: clientid ,
            cart: result, 
            client_email,
            client_phone
        });
      
    }))
    
    await updateTable()

    await new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve()
        }, 60*1000)
    })

    return callback(null, { success: true }) 
}



//ид платежки получаем доп опции 2.4
async function getProducts (value)  {
    //console.log('getProducts запущен')
    const response = await axios.get(`https://bbtuning2.server.paykeeper.ru/info/options/byid/?id=${value}`, {
            headers: {
                Authorization: `Basic ${authToken}`
            }
        })
    let data = response.data 
    let cart = JSON.parse(data.cart)
    let result = []
    for (let i = 0; i < cart.length; i++) {

        const name = cart[i].name;
        result.push(name)
    }
    
    let {client_email, client_phone} = data

    if (!client_email || !client_phone || !result) {
        //console.log(data)
        return {success: false}
    
    }

  
   return {result, client_email, client_phone, success: true }
}

module.exports = getPayments