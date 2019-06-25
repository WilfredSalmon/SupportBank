const fs = require('fs');
const parse = require('csv-parse/lib/sync')

//Gets the transaction data
function getTransactions(filename) {
    const transactions = [];
    const data = fs.readFileSync(filename,'utf8');
    return parse(data,{columns: true, skip_empty_lines: true});
}

// Gets the names of every person involved in the transactions
function getNames(transactions) {
    const names = [];

    for (let i=0; i<transactions.length; i++) {
        if (names.indexOf(transactions[i]['From']) < 0) {names.push(transactions[i]['From'])}
        if (names.indexOf(transactions[i]['To']) < 0) {names.push(transactions[i]['To'])}
    }

    return names;
}

exports.getAllData = function(filename) {
    const transactions = getTransactions(filename);
    const names = getNames(transactions);
    return [names,transactions];
}