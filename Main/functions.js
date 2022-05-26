const inquirer = require('inquirer');
const mysql = require('mysql2');
const ct = require('console.table');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'chris',
    database: 'employeetracker_db',
    }, 
    console.log("Connected to employeetracker_db")
);

class Functions {
    // view all employees
    viewAll(){
        const sql = `
        SELECT
            employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON department.id = role.department_id
        LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.table(result);
        })
        
        this.start();
    };

    // prompts user to select an action
    start(){
        inquirer
            .prompt([
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
                        {name:'Quit', value:'quit'}
                    ]
                },
            ])
            .then(res => {
                switch (res.task) {
                    case 'viewAll': this.viewAll();
                    break;
                    case 'viewDepts': this.viewDept();
                    break;
                    case 'viewRoles': this.viewRoles();
                    break;
                    case 'addDept': this.addDept();
                    break;
                    case 'addRole': this.addRole();
                    break;
                    case 'addEmployee': this.addEmployee();
                    break;
                    case 'updateEmployee': this.updateEmployeeRole();
                    break;
                    case 'quit': this.quit();
                }
            })
    };

    // quit app and disconnect from database
    quit(){
        if (connection) {
            connection.end(function() {
                console.log("Connection to database closed.");
            });
        }
        console.log("Exiting");
    };

    // view all departments
    viewDept(){
        const sql = `
        SELECT
            department.name AS department_name, department.id AS department_id
        FROM department;` ;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.table(result);
        })
        this.start();
    };

    // view all roles
    viewRoles(){
        const sql = `
        SELECT
            role.title AS role, role.id AS ID, department.name AS department, role.salary AS salary
        FROM role
        JOIN department ON role.department_id = department.id;` ;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.table(result);
        })
        this.start();
    };

    // add a department
    addDept(){
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is the name of the new department you would like to add?',
                    name: 'newDept'
                }
            ])
            .then(res => {
                const sql = `
                INSERT INTO department (name)
                VALUES ("${res.newDept}")`;

                connection.query(sql, (error, result) => {
                    if (error) throw error;
                    console.log(`${res.newDept} has been added to the list of Departments.`)
                })
            })
            this.start();
    };

    // adds an employee to database
    addEmployee(){
        const roles = [];
        connection.query("SELECT * FROM role", (error, res) => {
            if (error) throw error;

            res.forEach(res => {
                let roleRow = {
                    name: res.title,
                    value: res.id
                }
                roles.push(roleRow);
            })
        });

        const managers = [];
        connection.query(`SELECT CONCAT(employee.first_name, " ", employee.last_name) AS manager, employee.id AS id, employee.manager_id
                            FROM employee 
                            WHERE employee.manager_id IS NULL ; `, (error, res) => {
            if (error) throw error;

            res.forEach(manager => {
                let managerChoice = {
                    name: manager.manager,
                    value: manager.id
                }
                managers.push(managerChoice);
            })
        });

        inquirer
            .prompt([
                {
                    type: 'input',
                    message: "What is the new employee's first name?",
                    name : 'first_name'
                },
                {
                    type: 'input',
                    message: "What is the new employee's last name?",
                    name: 'last_name'
                },
                {
                    type: 'list',
                    message: "What is the new employee's role?",
                    name: 'role',
                    choices: roles
                },
                {
                    type: 'list',
                    message: "What is the new employee's manager?",
                    name: 'manager',
                    choices: managers
                }
            ])
            .then(res => {
                const sql = `
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${res.first_name}", "${res.last_name}", ${res.role}, ${res.manager})`;

                connection.query(sql, (error, result) => {
                    if (error) throw error;
                    console.log(`${res.first_name} ${res.last_name} has been added to the list of Employees.`)
                })
            })
        this.start();
    };

    // adds role to database
    addRole(){
        const depts = [];
        connection.query("SELECT * FROM department", (error, res) => {
            if (error) throw error;
            res.forEach(res => {
                let deptRow = {
                    name: res.name,
                    value: res.id
                }
                depts.push(deptRow);
            })
        });

        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is the name of the new role?',
                    name: 'roleName'
                },
                {
                    type: 'input',
                    message: "What is the salary for this role?",
                    name: "salary",
                    validate(value) {
                        if (isNaN(value)){
                            return "Input can only be number."
                        } else {
                            return true;
                        }
                    }
                },
                {
                    type: "list",
                    message: "Please select a department that this is role will be in.",
                    name: "dept",
                    choices: depts
                }
            ])
            .then(res => {
                const sql = `
                INSERT INTO role (title, salary, department_id)
                VALUES ("${res.roleName}", ${res.salary}, ${res.dept})`;

                connection.query(sql, (error, result) => {
                    if (error) throw error;
                    console.log(`${res.roleName} has been added to the list of Roles.`)
                })
            });
            .then()
        this.start();
        
    };

    //changes the role title of an already existing employee
    updateEmployeeRole(){
        const employees = [];
        connection.query(`SELECT CONCAT(employee.first_name, " ", employee.last_name) AS employee, employee.id AS id 
                            FROM employee`, 
            (error, res) => {
            if (error) throw error;
            // console.log(res);
            res.forEach(res => {
                let employeeChoice = {
                    name: res.employee,
                    value: res.id
                };
                employees.push(employeeChoice);
            })
        // console.log(employees);
        });

        const roles = [];
        connection.query("SELECT * FROM role", (error, res) => {
            if (error) throw error;

            res.forEach(res => {
                let roleRow = {
                    name: res.title,
                    value: res.id
                }
                roles.push(roleRow);
            })
        // console.log(roles);
        });

        inquirer
            .prompt([
                {
                    type: "confirm",
                    message: "Any changes made will be permanent. Do you wish to proceed?",
                    name: "warning"
                },
                {
                    type: "list",
                    message: "Select the Employee that wish to update.",
                    name: "employeeSelect",
                    choices: employees,
                },
                {
                    type: 'list',
                    message: 'Select the role to assign to the Employee. This will override previous role.',
                    name: 'role',
                    choices: roles
                }
            ])
            .then(res => {
                const sql = `
                UPDATE employee
                SET role_id = ${res.role}
                WHERE id = ${res.employeeSelect};`

                connection.query(sql, (error, result) => {
                    if (error) throw error;
                    console.log(`Role has been updated for this Employee.`)
                })
            })
        this.start();
    };
}



module.exports = Functions;