const csvParse = require('csv-parse/lib/sync');
const FileParser = require('./FileParser');
const Transaction = require('./Transaction');

module.exports = class csvFileParser extends FileParser {

    constructor(logger) {
        super(logger);
    }

    parse(data) {
        this.logger.debug('parsing data as csv');
        const tempData = csvParse(data, {columns: true, skip_empty_lines: true});
        this.logger.debug('Data parsed, now refactoring');
        const dataToReturn = this.refactorIntoRequiredForm(tempData, ['Date', 'From', 'To', 'Narrative', 'Amount'],this.logger);

        return this.getDataFromDataToReturn(dataToReturn, 'csv');
    }
}