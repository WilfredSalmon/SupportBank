// Setting up logger
const log4js = require('log4js');
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});
const logger = log4js.getLogger('<index.js>');

// IMPORTING
logger.debug('Program Starting. Importing modules');
const readline = require('readline-sync');
const getData= require('./getData');
const listAll = require('./listAll');
const listIndiv = require('./listIndiv');
const userInputs = require('./userInputs');


//Vars
logger.debug('Setting some costants');
const listAllMode = 'List All';
const listIndivMode = 'List';
const importMode = 'Import File'
const welcomeMessage = 'Welcome to the Transaction history calculator';

const menu = `Available commands: 
${listAllMode} \t:list the total of who owes what amount of money
${listIndivMode} \t: give a detailed history of an individual
${importMode}  \t:import a different file`;


//ENTRY
//Get the data
logger.debug('Calling get data');
let data = getData.getAllData(logger);

console.log(welcomeMessage);

while (true) {
    logger.debug('Entering Transaction screen')
    const input = userInputs.getInput(menu);
    if (input === listAllMode) {
        logger.debug(`Calling ListAllMode with input ${input}`);
        listAll.listAll(data,logger);
    } else if (input === listIndivMode) {
        logger.debug(`Calling ListIndivMode with input ${input}`);
        listIndiv.listIndiv(data,logger);
    } else if (input === importMode) {
        logger.debug(`getting new data with input ${input}`);
        data = getData.getAllData(logger);
    }
    else {
        logger.warn(`Mode was not recognised. Input was ${input}.`);
        console.log(`Mode not recognised. Please try again!`);
    }

    console.log('---------------------------------')
}
