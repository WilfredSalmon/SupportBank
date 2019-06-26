const FileParser = require('./FileParser');
const Transaction = require('./Transaction');

module.exports = class JsonFileParser extends FileParser {

    constructor(logger) {
        super(logger);
    }

    parse(data) {
        this.logger.debug('parsing data as json');
        const tempData = JSON.parse(data);
        this.logger.debug('Data parsed, now refactoring');
        const dataToReturn = this.refactorIntoRequiredForm(tempData, ['Date', 'FromAccount', 'ToAccount', 'Narrative', 'Amount'],this.logger);

        return this.getDataFromDataToReturn(dataToReturn, 'json');
    }
}