const fs = require('fs');
const parse = require('csv-parse/lib/sync')


//Gets the transaction data
function getTransactions(filename,logger) {
    logger.debug('Getting Transactions')
    const data = fs.readFileSync(filename,'utf8');
    logger.debug('Got data into JS successfully');
    return parse(data,{columns: true, skip_empty_lines: true});
}

// Gets the names of every person involved in the transactions
function getNames(transactions,logger) {
    logger.debug('Starting getNames');
    const names = [];

    for (let i=0; i<transactions.length; i++) {
        if (names.indexOf(transactions[i]['From']) < 0) {names.push(transactions[i]['From']); logger.debug(`Added ${transactions[i]['From']} to names from FROM column`);}
        if (names.indexOf(transactions[i]['To']) < 0) {names.push(transactions[i]['To']); logger.debug(`Added ${transactions[i]['To']} to names from TO column`);}
    }

    logger.debug(`Names complete, about to exit getNames with names ${names}`);
    return names;
}

exports.getAllData = function(filename,logger) {


    logger.debug('Getting Transactions');
    const transactions = getTransactions(filename,logger);
    logger.debug('Geting Names');
    const names = getNames(transactions,logger);
    logger.debug('Exiting getAllData');
    return {names: names, transactions: transactions};
}