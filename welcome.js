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
var available = [];

connection.connect((err) => {
    if(err) throw err;
    // promptList('action',storeOptions,'Welcome to bamazon',returnPrompt);
    // departmentPop('automotive');
    availablePop();
    openStore();
});

function returnPrompt(answer) {
    // console.log(answer);
    for (var x = 0; x <available.length; x++) {
        switch(answer.view){
            case available[x]:
            var item_id;
            var item_quant;
            var item_cost;
            connection.query('SELECT * FROM products WHERE ?', {item_name: available[x]},(err,res) =>{
                console.log('\n\n');
                res = res[0];
                item_id = res.id;
                item_quant = res.avail_quantity;
                item_cost = res.price;
                console.log('Item: ' + res.item_name+
                            '\nDepartment: ' +res.department_name +
                            '\nPrice: $' + res.price +
                            '\nQuantity: ' + res.avail_quantity + '\n\n');
                inquirer.prompt({name: 'purchase', type:'list',message: 'Would you like to purchase this item?', choices: ['yes','no']})
                .then(answers => {
                    switch (answers.purchase) {
                        case 'yes':
                            inquirer.prompt({name: 'amount', type:'input',message: 'How many would you like?'})
                            .then(answers => {
                                purchaseItem(item_id, item_quant, answers.amount, item_cost);
                                });
                        break;
                        case 'no':
                        openStore();
                        break;
                    }
                })
            }); // end query
            return;
            
        } // end switch
    }
    
    switch(answer.action) {
     
        case storeOptions[0]:
        console.clear();
        console.log('here are the items available for purchase');
        allPop();
        break;
        case storeOptions[1]:
        console.clear();
        console.log('here are the available departments')
        toDepartments();
        break;
        case storeOptions[2]:
        console.clear();
        console.log('lets add an item');
        addItem();
        break;
        case departments[0]:
        console.clear();
        console.log('welcome to the ' + departments[0] +' department.');
        departmentPop(departments[0]);
        // toDepartments();
        break;
        case departments[1]:
        console.clear();
        console.log('welcome to the ' + departments[1] +' department.');
        departmentPop(departments[1]);
        // toDepartments();
        break;
        case departments[2]:
        console.clear();
        console.log('welcome to the ' + departments[2] +' department.');
        departmentPop(departments[2]);
        // toDepartments();
        break;
        case departments[3]:
        console.clear();
        console.log('welcome to the ' + departments[3] +' department.');
        departmentPop(departments[3]);
        toDepartments();
        break;
        default:
        console.clear();
        console.log('something went wrong');
        return openStore();
    }
};


function availablePop() {
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        // console.log(res[0].item_name);
        for(var x=0; x<res.length; x++) {
            available.push(res[x].item_name);
        };
        // console.log(available);
    });
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

function openStore() { promptList('action',storeOptions,'Welcome to bamazon',returnPrompt); };
function toDepartments() { promptList('action', departments,'Which department would you like to view?', returnPrompt); };

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
    promptList('view',pop,'which item would you like to view',returnPrompt);
};

function purchaseItem(itemId, aQuant, quant,cost) {
    var availQ = aQuant;     
    if(quant> availQ) {
        console.log("There's not enough quantity for that purchase");
        openStore();
    } else {  
        var sqlC = 'UPDATE products SET avail_quantity ='+ (availQ -quant) +' WHERE id ='+ itemId+';';
        connection.query(sqlC,(err,res) => {
            if (err) throw err;
            if(res.protocol41) {
                console.log('\nheres your order \n' +'total cost: $' + (cost*quant)+'\n');
            }
        });
        availQ -= quant; 
        if(availQ <= 0) {
            sqlC = 'DELETE FROM products WHERE id='+itemId+';';
            connection.query(sqlC,(err,res) => {
                if (err) throw err;
                if(res.protocol41) {
                    console.log('thanks for purchasing our total inventory \n\n');
                }
            });
        }  
        setTimeout(morePurchases,1000);
    }
};

function morePurchases() {
    inquirer.prompt({name: 'again',type:'list',message: 'Would you like to view more items?', choices: ['yes','no']})
        .then(answers => {
            if (answers.again === 'yes') {
                openStore();
            } else {
                return console.log("thanks for shopping at bamazon, where everythings instant and imaginary"), connection.end();
            }
        }); 
};

function addItem() {
    var newSql = 'INSERT INTO products (item_name, department_name, price, avail_quantity) VALUES (?,?,?,?)';
    inquirer.prompt([{name: 'name', type: 'input', message: 'Whats your item name'},
    {name: 'department', type:'list', choices: departments, message:'Which department suits your item?'},
    {name: 'price', type:'input', message:'How much would you like for your item?'},
    {name: 'quantity', type: 'input', message:'available quantity: '}])
    .then(answers =>{
        connection.query(newSql,[answers.name, answers.department, answers.price, answers.quantity], (err,res) =>{
            if(err) {console.log(err.sqlMessage), openStore();}
            else {
            console.log(res.affectedRows + ' inventory created');
            availablePop();
            openStore();
            }
        })
    })
};
