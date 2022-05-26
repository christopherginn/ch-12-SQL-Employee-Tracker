const inquirer = require('inquirer');
const ct = require('console.table');
const Functions = require('./functions');

const query = new Functions;

inquirer
    .prompt([
        {
            type: 'input',
            message: 'Welcome to the SQL Employee Tracker CLI app. Press any key to start.',
            name: 'welcome'
        },
    ])
    .then( res => {
        query.start()
    });


