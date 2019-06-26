const userInput = require('./userInputs');
const moment = require('moment');

//Gets the name to be listed
function getName(names,logger) {
    while (true) {
        const name = userInput.getInput(`Please enter a name. Valid names are: ${names.join()}`)
        if (names.indexOf(name) >= 0) {
            logger.debug(`Returning name ${name}`);
            return name;
        }
        else {
            logger.warn(`Invalid name choice: ${name}`)
            console.log('Invalid name choice!');
        }
    }
}

function getDate(transaction, formatType, logger) {
    const date = transaction.getMoment(formatType);
    const formattedDate = date.format("dddd, MMMM Do YYYY");

    if (formattedDate === 'Invalid date') {
        console.log(`Warning, Transaction ${transaction.From} to ${transaction.To} has an invalid date`);
        logger.error(`Warning, Transaction ${transaction.From} to ${transaction.To} has an invalid date`);
    }
    return formattedDate;
}

exports.listIndiv = function(data,logger) {
    logger.debug('Called listIndiv. Calling getName')
    const transactions = data.transactions;
    const names = data.names;

    const name = getName(names,logger);
    logger.debug('getName exited. About to start adding to response')

    const response = transactions.filter((transaction) => {
        return transaction.From === name || transaction.To === name;
    }).map((transaction) => {
        const formattedDate = getDate(transaction, data.dateFormatType, logger);
        return `On ${formattedDate}, \t\t${transaction.From} paid \t${transaction.To} \t£${transaction.Amount} for \t${transaction.Narrative}`;
    }).join('\n')

    console.log(response);
    logger.debug('Finished List indiv, exiting now.')
};