//Defines the data class
module.exports = class Data {
    constructor(transactions, dateFormatType, names =[]) {
        this.transactions = transactions;
        this.dateFormatType = dateFormatType;
        this.names = names;
    }
}