var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Wh0v1@n",
    database: "bamazon_db"
});
/// @todo --- establish functions to select database and edit databse. 
var storeOptions = ['view all available items', 'jump to specific department', 'add an item'];
var departments = ['automotive', 'appliances and tech', 'sports and leasure', 'misc'];

connection.connect((err) => {
    if(err) throw err;
    // openStore();
    // promptList('action',storeOptions,'Welcome to bamazon',returnPrompt);
    // departmentPop('automotive');
    allPop();
});

function returnPrompt(answer) {
    switch(answer.action) {
        case storeOptions[0]:
        console.log('here are the items available for purchase');
        // itemPop();
        break;
        case storeOptions[1]:
        console.log('here are the available departments')
        toDepartments();
        break;
        case storeOptions[2]:
        console.log('lets add an item');
        // addItem();
        break;
        case departments[0]:
        console.log('welcome to the ' + departments[0] +' department.');
        // search(departments[0])
        toDepartments();
        break;
        case departments[1]:
        console.log('welcome to the ' + departments[1] +' department.');
        // search(departments[1])
        toDepartments();
        break;
        case departments[2]:
        console.log('welcome to the ' + departments[2] +' department.');
        // search(departments[2])
        toDepartments();
        break;
        case departments[3]:
        console.log('welcome to the ' + departments[3] +' department.');
        // search(departments[3])
        toDepartments();
        break;
        default:
        console.log('something went wrong');
        return openStore();
    }
};

function promptList(name, choices, message, callback) {
    inquirer.prompt({
        name: name,
        type: 'list',
        message: message,
        choices: choices
    }).then( answers => {
        callback(answers);
    })
};

function openStore() {
    promptList('action',storeOptions,'Welcome to bamazon',returnPrompt);
};
function toDepartments() {
    promptList('action', departments,'Which department would you like to view?', returnPrompt);
};

function departmentPop(department) {
    var query = 'SELECT * FROM products WHERE ?'
    connection.query(query,{department_name: department}, (err, res) => {
        if (err) throw err;
        console.log(res);
    })
};

function allPop() {
    var query = 'SELECT * FROM products'
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
    })
};