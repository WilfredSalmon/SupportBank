const moment = require('moment')
moment().format();
const date = '22/03/2014';
const newDate = moment(date,'DD-MM-YYYY');
console.log(newDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));

const badDate = moment('ASBDHASBDJASD','DD-MM-YYYY');
console.log(badDate.format());