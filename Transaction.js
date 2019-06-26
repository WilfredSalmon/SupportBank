const moment = require('moment');

//Defines the transaction class
module.exports = class Transaction {
    constructor (date, from, to, narrative, amount) {
        this.date = date;
        this.From = from;
        this.To = to;
        this.Narrative = narrative;
        this.Amount = amount;
    }

    getMoment(type) {
        if (type === 'csv') {
            return moment(this.date, 'DD-MM-YYYYY');
        } else if (type === 'json') {
            return moment(this.date);
        } else {
            return moment('01-01-1900', 'DD-MM-YYYY').add(this.date - 1,'d');
        }
    }

    static fromTransactionProperties(transactionProperties) {
        return new Transaction(
            transactionProperties[0],
            transactionProperties[1],
            transactionProperties[2],
            transactionProperties[3],
            transactionProperties[4]
        );
    }
}