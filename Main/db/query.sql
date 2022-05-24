-- -- View all departments
-- SELECT
--     department.name AS department_name, department.id AS department_id
-- FROM department;


-- -- View all roles
-- SELECT
--   role.title AS role, role.id AS ID, department.name AS department, role.salary AS salary
-- FROM role
-- JOIN department ON role.department_id = department.id;

-- -- View all employees
-- SELECT
--     employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
-- FROM employee
-- INNER JOIN role ON employee.role_id = role.id
-- INNER JOIN department ON department.id = role.department_id
-- -- INNER JOIN employee manager ON employee.manager_id = manager.id;
-- LEFT JOIN employee manager ON employee.manager_id = manager.id;

SELECT CONCAT(employee.first_name, " ", employee.last_name) AS manager, employee.id AS id
FROM employee 
WHERE employee.manager_id IS NULL ; 