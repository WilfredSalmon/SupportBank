const Transaction = require('./Transaction');
const Data = require('./Data');

test = new Transaction(0,1,2,3,4);

module.exports = class FileParser {
    constructor (logger) {
        this.logger = logger;
    }

    refactorIntoRequiredForm(tempData,listOfPaths,logger) {
        const numberOfEntries = tempData.length;

        return tempData.map((transaction) => {
            const transactionProperties = listOfPaths.map((val) => this.getNestedObjectElt(transaction,val));
        this.logger.debug(`Adding new transaction with values ${transactionProperties}`);
        return Transaction.fromTransactionProperties(transactionProperties);
        })
    }

    //Gets a nested object element from a path
    getNestedObjectElt (obj,path) {
        return path.split('.').reduce((currObj,nextPartOfPath) => currObj[nextPartOfPath],obj);
    }

    getDataFromDataToReturn(dataToReturn, dateFormatType) {
        return new Data(dataToReturn, dateFormatType);
    }
}