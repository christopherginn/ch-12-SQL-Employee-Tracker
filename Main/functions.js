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
}

module.exports = Functions;