const userInput = require('./userInputs');
const moment = require('moment');

//Gets the name to be listed
function getName(names) {
    const name = userInput.getInput(`Please enter a name. Valid names are: ${names.join()}`)
    if (names.indexOf(name) >= 0) {return name;}
    else {
        console.log('Invalid name choice!');
        return getName(names);
    }
}

exports.listIndiv = function(transactions,names) {
    const name = getName(names);
    let response = ``;
    for (let i=0;i<transactions.length;i++) {
        if (transactions[i]['From'] === name || transactions[i]['To'] === name) {
            const date = moment(transactions[i]['Date'],'DD-MM-YYYY');
            response += `On ${date.format("dddd, MMMM Do YYYY, h:mm:ss a")}, \t\t${transactions[i]['From']} paid \t${transactions[i]['To']} \t£${transactions[i]['Amount']} for \t${transactions[i]['Narrative']}\n`
        }
    }
    console.log(response);
}