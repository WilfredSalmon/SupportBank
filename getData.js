const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');
const userInputs = require('./userInputs');
const xmlParse = require('pixl-xml');
const moment = require('moment');

//Defines the transaction class
class Transaction {
    constructor (date,from,to,narrative,amount) {
        this.Date = date;
        this.From = from;
        this.To = to;
        this.Narrative = narrative;
        this.Amount = amount;
    }

    getMoment(type) {
        if (type === 'csv') {
            return moment(this.Date,'DD-MM-YYYYY');
        } else if (type === 'json') {
            return moment(this.Date,'');
        } else {
            return moment('01-01-1900','DD-MM-YYYY').add(this.Date - 1,'d');
        }
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

        if (fileType===false) {
                logger.debug('File type was not suuported')
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
        return false;
    }
}

function refactorIntoRequiredForm(tempData,listOfPaths,logger) {
    const entries = tempData.length;
    const dataToReturn = new Array(entries);

    for (let i = 0; i < entries; i++) {
        const transaction = tempData[i];
        const vals = listOfPaths.map((val) => getNestedObjectElt(transaction,val));
        logger.debug(`Adding new transaction with values ${vals}`);
        dataToReturn[i] = new Transaction(vals[0],vals[1],vals[2],vals[3],vals[4]);
    }
    return dataToReturn;
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
    const names = [];

    for (let i=0; i<transactions.length; i++) {
        const transaction = transactions[i];
        if (names.indexOf(transaction['From']) < 0) {names.push(transaction['From']); logger.debug(`Added ${transaction['From']} to names from FROM column`);}
        if (names.indexOf(transaction['To']) < 0) {names.push(transaction['To']); logger.debug(`Added ${transaction['To']} to names from TO column`);}
    }

    logger.debug(`Names complete, about to exit getNames with names ${names}`);
    return names;
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