// IMPORTING
const readline = require('readline-sync');
const getData= require('./getData');
const listAll = require('./listAll');
const listIndiv = require('./listIndiv');
const userInputs = require('./userInputs');


//Vars
const filename = './Transactions2014.csv'

const listAllMode = 'List All';
const listIndivMode = 'List';
const welcomeMessage = 'Welcome to the Transaction history calculator';

const menu = `Available commands: 
${listAllMode} Will list the total of who owes what amount of money
${listIndivMode} Will give a detailed history of that individual`;


//ENTRY
//Get the data
const data = getData.getAllData(filename)
const transactions = data[1];
const names = data[0];

console.log(welcomeMessage);
while (true) {
    const input = userInputs.getInput(menu);
    if (input === listAllMode) {
        listAll.listAll(transactions,names);
    } else if (input === listIndivMode) {
        listIndiv.listIndiv(transactions,names);
    } else {console.log('Mode not recognised. Please try again!')}

    console.log('---------------------------------')
}
