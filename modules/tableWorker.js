const {
    GoogleSpreadsheet
} = require('google-spreadsheet');
const mongoose = require('mongoose');

//модели
const Payments = require("../models/Payments.models")

const configTable = require('./configTable.json')

async function createHeader(sheet) {

    await sheet.loadCells('A1:E1');
    const a1 = await sheet.getCellByA1('A1');
    const a2 = await sheet.getCellByA1('B1');
    const a3 = await sheet.getCellByA1('C1');
    const a4 = await sheet.getCellByA1('D1');
    const a5 = await sheet.getCellByA1('E1');

    a1.value = 'Instagram'
    a2.value = 'Email'
    a3.value = 'Phone'
    a4.value = 'Product'
    a5.value = 'Date'

    await sheet.saveUpdatedCells()
    return
}

const updateTable = async () => {
    const doc = new GoogleSpreadsheet('1cJ6UTgzLXs6xZycif0UjIEv0eE-zx4yUYpD1UVFBJ74');

    await doc.useServiceAccountAuth({
        client_email: configTable.client_email,
        private_key: configTable.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets

    let payments = await Payments.find()

    let sheet = doc.sheetsByIndex[0];

    // Чистим таблицу
    await sheet.clear()
    
    // Создаем шапку 
    await createHeader(sheet)

    let products = [];
    await Promise.all(
        payments.map(async payment => {
            let { cart, client_email, nameClient, client_phone, date} = payment;
            await Promise.all(
                cart.map(item => {
                    
                    products.push({
                        Instagram: nameClient,
                        Email: client_email,
                        Phone: `'${client_phone}`,
                        Product: item,
                        Date: date
                    })
                })
            )

        })
    )

    await sheet.addRows(products);
    console.log('Записал в таблицу')
}

module.exports = {
    updateTable
}