//requiring libraries
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "2020",
    database: "employee_trackerDB"
  });

  connection.connect(function(err) {
    if (err) throw err;
    runSearch();
  });
  
  function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add Department",
            "Add Employee",
            "Add Role",
            "View All Departments",
            "View All Employees",
            "View All Roles",
            "Update Employee Role",
            "EXIT"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Add Department":
          addDepartment();
          break;
  
        case "Add Employee":
          addEmployee();
          break;
  
        case "Add Role":
          addRole();
          break;
  
        case "View All Departments":
          viewDepartments();
          break;
  
        case "View All Employees":
          viewEmployess();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Update Employee Role":
            updateRoles();
            break;
        case "EXIT":
            connection.end();
            break
        }
      });
  }