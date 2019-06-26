const userInput = require('./userInputs');
const moment = require('moment');

//Gets the name to be listed
function getName(names,logger) {
    logger.debug('Called getName');
    const name = userInput.getInput(`Please enter a name. Valid names are: ${names.join()}`)
    if (names.indexOf(name) >= 0) {
        logger.debug(`Returning name ${name}`);
        return name;
    }
    else {
        logger.warn(`Invalid name choice: ${name}`)
        console.log('Invalid name choice!');
        return getName(names);
    }
}

exports.listIndiv = function(transactions,names,logger) {
    logger.debug('Called listIndiv. Calling getName')

    const name = getName(names,logger);
    logger.debug('getName exited. About to start adding to response')
    let response = ``;
    for (let i=0;i<transactions.length;i++) {
        if (transactions[i]['From'] === name || transactions[i]['To'] === name) {
            const date = moment(transactions[i]['Date'],'DD-MM-YYYY');
            const formattedDate = date.format("dddd, MMMM Do YYYY, h:mm:ss a");
            logger.debug(`i = ${i}, date = ${formattedDate}`);

            if (formattedDate === 'Invalid date') {
                console.log(`Warning, Transaction ${i} has an invalid date`);
                logger.error(`Error, Transaction ${i} has an invalid date`);
            }

            response += `On ${formattedDate}, \t\t${transactions[i]['From']} paid \t${transactions[i]['To']} \t£${transactions[i]['Amount']} for \t${transactions[i]['Narrative']}\n`
        }
    }
    console.log(response);
    logger.debug('Finished List indiv, exiting now.')
};