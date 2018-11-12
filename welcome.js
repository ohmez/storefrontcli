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
var storeOptions = ['view available items', 'jump to specific department', 'add an item'];
var departments = ['automotive', 'appliances and tech', 'sports and leasure', 'misc'];

connection.connect((err) => {
    if(err) throw err;
    // openStore();
    promptList('action',storeOptions,'Welcome to bamazon',returnPrompt);
});

function returnPrompt(answer,) {
    switch(answer.action) {
        case storeOptions[0]:
        console.log('here are the items available for purchase');
        // itemPop();
        break;
        case storeOptions[1]:
        console.log('here are the available departments')
        promptList('action', departments,'Which department would you like to view?', returnPrompt);
        break;
        case storeOptions[2]:
        console.log('lets add an item');
        break;
        case departments[0]:
        // search('automotive')
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
