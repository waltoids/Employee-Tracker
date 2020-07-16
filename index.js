//requiring libraries
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "2020",
    database: "employee_trackerDB",
    multipleStatements: true
  });

connection.connect(function(err) {
    if (err) throw err;
    start();
  });

  // Inquirer function with list of actions user can take
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
            updateEmployeeRole();
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

  function addEmployee() {
    const roleQuery = 'SELECT * from role;';
    connection.query (roleQuery, function (err, res) {
      if (err) throw err;
    
    // prompt for info about the employee that is being added
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the first name of the employee?"
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the last name of the employee?"
        },
        {
          name: "role_id",
          type: "list",
          message: "Employee's role:",
          choices: function() {
            let choiceArray = res.map(choice => choice.title);
            return choiceArray;
          }
        },
        {
          name: "manager_id",
          type: "input",
          message: "Manager's ID:"
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?,(SELECT id FROM role WHERE title = ? ), ?)`,
          [
            answer.first_name, answer.last_name, answer.role_id, answer.manager_id
          ]),
          function(err) {
            if (err) throw err;
            console.log("Employee's data was created successfully!");
            // re-prompt the user for what they want to do.
          }
          start();
        });
      });
    }
  

  function addRole() {
    // prompt for info about the role that is being added
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Input Role title:"
        },
        {
          name: "salary",
          type: "input",
          message: "Input salary for role:"
        },
        {
          name: "department_id",
          type: "input",
          message: "Input department ID for role:"
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id
          },
        
          function(err) {
            if (err) throw err;
            console.log("Your role was created successfully!");
            // re-prompt the user for what they want to do.
            start();
          }
        );
      });
  }

  function viewDepartments() {
    connection.query(
      "SELECT id, name AS department FROM department", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
      }
    )
  };

  function viewEmployess() {
    connection.query(
      "SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
      }
    )
  };

  function viewRoles() {
    connection.query(
      "SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
      }
    )
  };

  function updateEmployeeRole() {
    
    const query = `SELECT CONCAT (first_name," ",last_name) AS full_name FROM employee; SELECT title FROM role`
    connection.query(query, function(err, res) {
      if (err) throw err;

    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Choose an employee to update role:",
          choices: function () {
            let choiceArray = res[0].map(choice => choice.full_name);
            return choiceArray;
          }
        },
        {
          name: "newRole",
          type: "list",
          message: "Choose a new role for the employee:",
          choices: function () {
            let choiceArray = res[1].map(choice => choice.title);
            return choiceArray;
          }
        }
      ])
      .then(function(answer) {
        connection.query(`UPDATE employee
        SET role_id = (SELECT id FROM role WHERE title = ? ) 
        WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?))`,
         [answer.newRole, answer.employee], function (err, res) {
                if (err) throw err;
      });
      console.log("Role updated successfully!")
      start();
    })
   
  })
};