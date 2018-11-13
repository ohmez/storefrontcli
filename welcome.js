var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
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
        allPop();
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
        departmentPop(departments[0]);
        // toDepartments();
        break;
        case departments[1]:
        console.log('welcome to the ' + departments[1] +' department.');
        departmentPop(departments[1]);
        // toDepartments();
        break;
        case departments[2]:
        console.log('welcome to the ' + departments[2] +' department.');
        departmentPop(departments[2]);
        // toDepartments();
        break;
        case departments[3]:
        console.log('welcome to the ' + departments[3] +' department.');
        departmentPop(departments[3]);
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
        // console.log(res);
        makePretty(res);
    })
};

function allPop() {
    var query = 'SELECT * FROM products'
    connection.query(query, (err, res) => {
        if (err) throw err;
        // console.log(res[0].item_name);
        makePretty(res);

    })
};

function makePretty(res) {
    var pop = [];
    for(var x=0; x<res.length; x++) {
        var item_x = {
            name: res[x].item_name,
            id: res[x].id,
            department: res[x].department_name,
            price: res[x].price,
            quantity: res[x].avail_quantity
        };
        pop.push(item_x);


    }
    promptList('action',pop,'which item would you like to view',returnPrompt);
    // to-do change action to view and create switch for view. 

    // console.log(pop);
};