//Lists the amount everyone owes and is owed
exports.listAll = function(transactions,names) {
    total = new Object();

    for (let i =0;i<names.length;i++) {
        total[names[i]] = 0;
    }

    for (let i=0;i<transactions.length;i++) {
        total[transactions[i]['From']] -= +transactions[i]['Amount'];
        total[transactions[i]['To']] += +transactions[i]['Amount'];
    }

    printTotal(total);
}

//Prints the total owed by everyone
function printTotal(total) {
    console.log('Final bill: ');

    for (let i in total) {
        if (total.hasOwnProperty(i)) {
            if (total[i] >=0) {console.log(`${i} is owed £ ${parseFloat(total[i]).toFixed(2)}`)}
            else              {console.log(`${i} owes £ ${-parseFloat(total[i]).toFixed(2)}`)};
        }
    }
}
