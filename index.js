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
    start();
  });
  
function start() {
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
            console.log("GoodBye!")
            connection.end();
            break
        }
      });
  }

function addDepartment() {
    // prompt for info about the department that is being added
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "Input department's name:"
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.name,
          },
        
          function(err) {
            if (err) throw err;
            console.log("Your department was created successfully!");
            // re-prompt the user for what they want to do.
            start();
          }
        );
      });
  }