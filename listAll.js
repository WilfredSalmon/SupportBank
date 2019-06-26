//Lists the amount everyone owes and is owed
exports.listAll = function (data,logger ) {
        logger.debug('Calling listAll');
        const transactions = data.transactions;
        const names = data.names;

        total = new Object();

        for (let i = 0; i < names.length; i++) {
            total[names[i]] = 0;
        }

        logger.debug(`total created as ${total}`)

        transactions.map((transaction) => {
            if (isNaN(+transaction['Amount'])) {
                console.log(`Warning, Transaction no. ${i} has an invalid amount. This is being set to £0.00`);
                logger.error(`Error, Transaction no. ${i} has an invalid amount`);
                transaction['Amount'] = 0;
            }

            logger.debug(`Transferring ${+transaction['Amount']} from ${transaction['From']} to ${transaction['To']}`)
            total[transaction['From']] -= +transaction['Amount'];
            total[transaction['To']] += +transaction['Amount'];
        })

        printTotal(total,logger);
}

function printTotal(total,logger) {
    logger.debug('printTotalCalled');
    console.log('Final bill: ');

    for (let i in total) {
        if (total.hasOwnProperty(i)) {
            logger.debug(`printing ${i}'s Total`);
            if (total[i] >= 0) {
                console.log(`${i} is owed £ ${parseFloat(total[i]).toFixed(2)}`);
            } else {
                console.log(`${i} owes £ ${-parseFloat(total[i]).toFixed(2)}`);
            }
            ;
        }
    }
    logger.debug('Done');
}