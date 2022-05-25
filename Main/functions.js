const inquirer = require('inquirer');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'chris',
    database: 'employeetracker_db',
    }, 
    console.log("Connected to employeetracker_db")
);

class Functions {
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
    };

    viewDept(){
        const sql = `
        SELECT
            department.name AS department_name, department.id AS department_id
        FROM department;` ;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.table(result);
        })
    };

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
    };

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
            
    };

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
    };

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
            })

        
    };

    updateEmployeeRole(){
        const employees = [];
        connection.query(`SELECT CONCAT(employee.first_name, " ", employee.last_name) AS employee, employee.id AS id 
                            FROM employee`, 
            (error, res) => {
            if (error) throw error;
            console.log(res);
            res.forEach(employee => {
                let employeeChoice = {
                    name: employee.employee,
                    value: employee.id
                }
                employees.push(employeeChoice);
            })
        console.log(employees);
        });
    }
}

module.exports = Functions;