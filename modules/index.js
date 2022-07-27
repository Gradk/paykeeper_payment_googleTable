const moment = require('moment');

const getDates = ( interval ) => {

    let startDate = moment().subtract(Number(interval), 'days').format("YYYY-MM-DD");
    console.log(startDate)
   

    //startDate = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD")

    let currentDate = moment().format("YYYY-MM-DD")

    console.log(startDate, currentDate )
    return { startDate, currentDate}

}

module.exports = { getDates }