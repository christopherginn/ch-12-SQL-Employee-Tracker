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
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'task',
            choices: [
                {name:'View All Employees', value:'viewAll'},
                {name:'View All Departments', value:'viewDepts'},
                {name:'View All Roles', value:'viewRoles'},
                {name:'Add a Department', value:'addDept'},
                {name:'Add a Role', value:'addRole'},
                {name:'Add an Employee', value:'addEmployee'},
                {name:'Update an Employee Role', value:'updateEmployee'},
            ]
        },
    ])
    .then(res => {
        switch (res.task) {
            case 'viewAll': query.viewAll();
            break;
            case 'viewDepts': query.viewDept();
            break;
            case 'viewRoles': query.viewRoles();
            break;
            case 'addDept': ;
            break;
            case 'addRole': ;
            break;
            case 'addEmployee': ;
            break;
            case 'updateEmployee': ;
        }
    })