const fs = require('fs');
const userInputs = require('./userInputs');
const XmlFileParser = require('./XmlFileParser');
const JsonFileParser = require('./JsonFileParser');
const CsvFileParser = require('./CsvFileParser');

let fileParser;

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

//Gets the transaction data
function getTransactions(filename,fileParser,logger) {
    logger.debug('Getting Transactions called')
    const data = fs.readFileSync(filename, 'utf8');
    logger.debug('Got data into JS successfully');

    return fileParser.parse(data);

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

function getFileParser(fileType,logger) {
    switch (fileType) {
        case '.csv': {
            return new CsvFileParser(logger);
        }
        case '.json': {
            return new JsonFileParser(logger);
        }
        case '.xml': {
            return new XmlFileParser(logger);
        }
        default: {
            logger.fatal('Somehow got unsupported type to getFileParser')
            throw 'Somehow got unsupported type to getFileParser'
        }
    }
}

exports.getAllData = function(logger) {
    logger.debug('Getting filename');
    const fileinfo = getFileInfo(logger);
    const fileParser = getFileParser(fileinfo.fileType,logger);
    logger.debug('Getting Transactions');
    const data = getTransactions(fileinfo.filename,fileParser,logger);
    logger.debug('Geting Names');
    data.names = getNames(data.transactions,logger);
    logger.debug('Exiting getAllData');
    return data;
}
