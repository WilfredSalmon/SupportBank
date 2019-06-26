const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');
const userInputs = require('./userInputs');
const xmlParse = require('pixl-xml');
const moment = require('moment');

//Defines the transaction class
class Transaction {
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

//Defines the data class
class Data {
    constructor(transactions, dateFormatType, names =[]) {
        this.transactions = transactions;
        this.dateFormatType = dateFormatType;
        this.names = names;
    }
}

//Gets a nested object element from a path
function getNestedObjectElt (obj,path) {
    return path.split('.').reduce((currObj,nextPartOfPath) => currObj[nextPartOfPath],obj);
}

// Gets the filename to import from
function getFileInfo(logger) {
    logger.debug('Getfilename called');
    const filename = userInputs.getInput('Please enter a filename to import from (with extension):');

    if (fs.existsSync(filename))  {
        logger.debug(`Got file with filename ${filename}`);
        const fileType = getFileType(filename,logger);

        if (fileType === null) {
            logger.debug('File type was not supported')
            return getFileInfo(logger);
        } else{
            logger.debug(`returning file with anme ${filename} and filetype ${fileType}`)
            return {filename: filename, fileType: fileType};
        }
    } else {
        console.log('File not found in directory, please try again');
        logger.warn(`filename ${filename} was not found in the directory`);
        return getFileInfo(logger);
    }
}

//Gets the type of the file to be imported
function getFileType(filename,logger) {
    logger.debug('Getting file type')
    const supportedTypes = ['.csv','.json','.xml'];

    const extension = filename.slice(filename.lastIndexOf('.'));

    if (supportedTypes.indexOf(extension) >= 0) {
        logger.debug(`extension ${extension} returned`);
        return extension;
    } else {
        logger.debug(`extension ${extension} was not supported`);
        console.log(`The filetype ${extension} is not suuported, please use one of ${supportedTypes.join(', ')}`)
        return null;
    }
}

function refactorIntoRequiredForm(tempData,listOfPaths,logger) {
    const numberOfEntries = tempData.length;

    return tempData.map((transaction) => {
        const transactionProperties = listOfPaths.map((val) => getNestedObjectElt(transaction,val));
        logger.debug(`Adding new transaction with values ${transactionProperties}`);
        return Transaction.fromTransactionProperties(transactionProperties);
    })
}

//Gets the transaction data
function getTransactions(fileinfo,logger) {
    logger.debug('Getting Transactions called')
    const data = fs.readFileSync(fileinfo.filename, 'utf8');
    logger.debug('Got data into JS successfully');

    if (fileinfo.fileType === '.csv') {;
        logger.debug('parsing data as csv');
        const tempData = csvParse(data, {columns: true, skip_empty_lines: true});
        logger.debug('Data parsed, now refactoring');
        const dataToReturn = refactorIntoRequiredForm(tempData, ['Date', 'From', 'To', 'Narrative', 'Amount'],logger);

        return new Data(dataToReturn, 'csv');

    } else if (fileinfo.fileType === '.json') {
        logger.debug('parsing data as json');
        const tempData = JSON.parse(data);
        logger.debug('Data parsed, now refactoring');
        const dataToReturn = refactorIntoRequiredForm(tempData, ['Date', 'FromAccount', 'ToAccount', 'Narrative', 'Amount'],logger);

        return new Data(dataToReturn, 'json');

    } else if (fileinfo.fileType === '.xml'){
        logger.debug('parsing data as xml');
        const tempData = xmlParse.parse(data).SupportTransaction;
        logger.debug('Data parsed, now refactoring');
        const dataToReturn = refactorIntoRequiredForm(tempData,['Date','Parties.From','Parties.To','Description','Value'],logger);
        return new Data(dataToReturn,'xml');

    } else {
        logger.fatal('Somehow got to getTransactions with unsupported filetype');
        throw 'file Type was not supported and you somehow got through the previous error handling step';
    }
}

// Gets the names of every person involved in the transactions
function getNames(transactions,logger) {
    logger.debug('Starting getNames');

    const fromNames = transactions.map(transaction => transaction.From);
    const toNames = transactions.map(transaction => transaction.To);
    const allNames = fromNames.concat(toNames);
    const uniqueNames = allNames.filter(function(name, index) {
        return allNames.indexOf(name) == index;
    });
    logger.debug(`Names complete, about to exit getNames with names ${uniqueNames}`);
    return uniqueNames;

}

exports.getAllData = function(logger) {
    logger.debug('Getting filename');
    const fileinfo = getFileInfo(logger);
    logger.debug('Getting Transactions');
    const data = getTransactions(fileinfo,logger);
    logger.debug('Geting Names');
    data.names = getNames(data.transactions,logger);
    logger.debug('Exiting getAllData');
    return data;
}