// Importing
const readline = require('readline-sync');

// FUNCTIONS //

// Get an input
function getInput(message) {
    console.log(message);
    return readline.prompt();
}

// Check if a variable is a number
function IsNo(input) {

    const test = +input;

    if (isNaN(test)) {
        return false;
    } else {
        return true;
    }
}

// Get a user inputed number prompted by message
function getNumber(message) {

    const input = getInput(message);

    if (IsNo(input)) {
        const number = +input;
        return number;
    } else {
        console.log('Please enter a valid number!');
        return getNumber(message);
    }

}

// TO EXPORT
exports.getInput = getInput;
exports.getNumber = getNumber;