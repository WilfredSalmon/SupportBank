const xmlParse = require('pixl-xml');
const FileParser = require('./FileParser');
const Transaction = require('./Transaction');

module.exports = class xmlFileParser extends FileParser {

    constructor(logger) {
        super(logger);
    }

    parse(data) {
        this.logger.debug('parsing data as xml');
        const tempData = xmlParse.parse(data).SupportTransaction;
        this.logger.debug('Data parsed, now refactoring');
        const dataToReturn = this.refactorIntoRequiredForm(tempData,['Date','Parties.From','Parties.To','Description','Value'],this.logger);

        return this.getDataFromDataToReturn(dataToReturn, 'xml');
    }
}