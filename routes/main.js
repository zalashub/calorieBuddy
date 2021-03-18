module.exports = function(app)
{

//Validation
const { check, validationResult } = require('express-validator');
const validator = require('express-validator');

//Custom validators to check whether an email is already registered or a username is already taken
//Email check
const emailInUse = (req, res, next) => {

	//Connect to the database
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
	MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                const db = client.db('calorieBuddy'); 
                let query = { email: {$regex: req.body.email} }; //find by email
		db.collection('users').find(query).toArray(function(findErr, results) {
			//console.log("email in use search result: ", results);
                        if (findErr) res.redirect('./register');
                        else if(results.length > 0) {
                                //console.log("Found email duplicate!");
				res.render('register', { pageTitle: 'Register' , err: ['email_taken'] });
                        } else {
				next();
			}
                        client.close();
                });
        });
}

//Username check
const usernameInUse = (req, res, next) => {

        //Connect to the database
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                const db = client.db('calorieBuddy');
                let query = { username: {$regex: req.body.username} }; //find by username
                db.collection('users').find(query).toArray(function(findErr, results) {
                        //console.log("username check search result: ", results);
                        if (findErr) res.redirect('./register');
                        else if(results.length > 0) { //Found a user already with this username
                                //console.log("Found username duplicate!");
                                res.render('register', { pageTitle: 'Register', err: ['username_taken'] });
                        } else {
                                next();
                        }
                        client.close();
                });
        });
}

//Custom validator to check whether a food is already in the database
const foodInDbs = (req, res, next) => {

	//Connect to the database
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                const db = client.db('calorieBuddy');
		let query = { name: {$regex: req.body.name} }; //find by food item name
		db.collection('food').find(query).toArray(function(findErr, results) {
		if (findErr) res.redirect('./addFood');
		else if(results.length > 0) { //this food item is already in the database
			console.log("Found food duplicate!");
			res.render('addFood', { pageTitle: 'Add', err: 'foodExists' });
			} else {
                                next();
                        }
                        client.close();
		});
        });
}

//Session management
const redirectLogin = (req, res, next) => {
	if (!req.session.userId ) {
     	  res.render('./login', { pageTitle: 'Login', err: null, redirected: true });
   	} else { 
	  console.log("you're logged in! proceed");
	  next (); 
	}
}

//Redirect route when user is already logged in (if they want to access the login or register page)
const redirectActive = (req, res, next) => {
	if(req.session.userId) { //user is already looged n
	  res.render('activeSession', {pageTitle: 'Hi' });
	} else { next(); }
}

//Render the home (index) page
app.get('/', function(req, res) {
	res.render('index', { pageTitle: 'Home' });
});

//The about page
app.get('/about', function(req, res) {
	res.render('about', { pageTitle: 'About' });
});

//The Register page
app.get('/register', redirectActive, function (req,res) {
	res.render('register', { pageTitle: 'Register', err: [] });
});

//The Registered page
//run validators and some sanitization on first and last name, email, username and password
app.post('/registered', [check('first').trim().escape().isAlpha()], [check('last').trim().escape().isAlpha()], [check('email').normalizeEmail().isEmail()], emailInUse, [check('username', 'Username must be at least 5 characters long').trim().escape().isLength({min:5})], usernameInUse, [check('password').trim().isLength({ min:8 })], function (req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Register Errors isn't empy! ", errors);
		let err = [];

		for (let i = 0; i < errors.errors.length; ++i) {
			err.push(errors.errors[i].param); //push each error in the errors array	
		}
		res.render('register', { pageTitle: 'Register', err: err });
	} else {

	const bcrypt = require('bcrypt');
	const saltRounds = 10;
	//First sanitize the password (strip unsafe tags and attributes) then store it
	const plainPassword = req.sanitize(req.body.password); 
	//Perform XSS Sanitization on every input
	const sanitizedName = req.sanitize(req.body.first);
	const sanitizedLast = req.sanitize(req.body.last);
	const sanitizedEmail = req.sanitize(req.body.email);
	const sanitizedUsername = req.sanitize(req.body.username);
	//Password hashing
	bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
	const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
	//Connect to MongoDB
	MongoClient.connect(url, function(err, client) {
		if (err) throw err;
                let db = client.db ('calorieBuddy');
                	db.collection('users').insertOne({
                	name: sanitizedName,
                	lastName: sanitizedLast,
                	email: sanitizedEmail,
			username: sanitizedUsername,
			password: hashedPassword
                });
                client.close();
		res.render('registered', { pageTitle: 'Registered', name: sanitizedName, lastName: sanitizedLast, username: sanitizedUsername, password: plainPassword, email: sanitizedEmail, hashedPassword: hashedPassword }); 
        });
       	});
	}
});

//The Login page
app.get('/login', redirectActive, function (req,res) {
          res.render('login', { pageTitle: 'Login', err: null, redirected: false });
});

//The Logged in route
app.post('/loggedin', function (req, res) {
	
	const bcrypt = require('bcrypt');
	const enteredUsername = req.body.username;
	let plainPassword = req.body.password;
	let hashedPassword; //empty for now
	let firstName;
	let lastName;
	
	//Connect to the database
	const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';

	MongoClient.connect(url, function (err, client) {
		if (err) throw err;
                const db = client.db('calorieBuddy');
		let query = { username: { $regex: enteredUsername } }; //search for the document based on the entered username
                db.collection('users').find(query).toArray(function(findErr, results) {
			console.log("Logged in search result: ", results[0]);
			if (findErr) res.redirect('./');
                        else if(results[0] == undefined) {
				res.render('login', {pageTitle: "Login", err: "username", redirected: false});
                        }
                        else { //Username exists
                                hashedPassword = results[0].password;
				firstName = results[0].name;
				lastName = results[0].lastName;
                             }
                        client.close();
			
			if(hashedPassword) {
				//compare user's password collected from the login page with the hashed password saved in the database
				bcrypt.compare(plainPassword, hashedPassword, function(err, result) {
					if (result == true) {
	                        		// **** save user session here, when login is successful
                        			req.session.userId = req.body.username;
						res.render('loggedin', { pageTitle: "Loggedin", name: firstName, lastName: lastName, username: req.body.username });
                			}			
                			else {
						res.render('login', {pageTitle: "Login", err: "password", redirected:false});
                			}
                		});
                	}
                });
         });
});

//The Logout page
app.get('/logout', redirectLogin, (req,res) => {
	req.session.destroy(err => {
		if (err) {
       		  return res.redirect('./')
     	  	}
		res.render('logout', {pageTitle: "Bye"});
     	})
});

//The List all food items page - availble to all
app.get('/foodList', (req,res) => {
	//Connect to the database
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
        MongoClient.connect(url, function(err, client) {
                if (err) throw err;
                let db = client.db ('calorieBuddy');
		db.collection("food").find().sort({name: 1}).toArray((findErr, result) => {
          		if (findErr) throw findErr;
			else res.render('foodList', {pageTitle: "All Food", foods: result});
          		client.close();
        	});
	});
});

//The Calculate Recipe route
app.get('/calculateRecipe', (req,res) => {
	console.log("calculateRecipe route!");
	//Connect to the database
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
	MongoClient.connect(url, function(err, client) {
                if (err) throw err;
                let db = client.db ('calorieBuddy');

	//Initial values for the recipe
	let calories = 0.0;
	let carbs = 0.00;
	let sugars = 0.00;
	let fat = 0.00;
	let protein = 0.00;
	let salt = 0.00;

	//Object of name-entered-amount pairs
	let name_amount = { };
	//Array of names of the foods that were checked (used for the MongoDB query)
	let namesArray = [ ];
	//Iterator for the query object - needed to get the correct values from req.query
	let iter = 0;
	
	for (const key in req.query) {
		//console.log(key, ":", req.query[key]);
		
		//Check which items were selected
		if(req.query[key] == "on") { //The checkbox next to the item was selected
		
			//Get the last character in the key so we can retrieve the rest of the correct values
			iter = key.charAt(key.length - 1); //will be 0, 1, 2, etc. depending on which item in the list was checked

			//Get the amount entered
			let amountKey = "calcAmount" + iter;
			//console.log("amountKey", amountKey);
			let enteredAmount = req.query[amountKey]; //Will use this to calculate the values in the recipe
			
			//Get the name of the food
			let nameKey = "foodName" + iter;
			//console.log("nameKey", nameKey);
			let foodName = req.query[nameKey];
			
			//Store the name and amount in key value pairs
			name_amount[foodName] = enteredAmount;

			//Store the names for a query
			namesArray.push(foodName);
		}
	};

	//Look for food items that are in the array
	let query = { name: { $in: namesArray  } };

                db.collection('food').find(query).toArray((findErr, results) => {		
			//Retrieve the food document and its values
			//console.log("results", results);

			//All of the data from one food item
			let typicalAmount = 0.0;
			let currCalories = 0.0;
			let currCarbs = 0.0;
			let currSugars = 0.0;
			let currFat = 0.0;
			let currProtein = 0.0;
			let currSalt = 0.0;

			//Iterate over the results
			for(let food of results) {
			
				typicalAmount = parseFloat(food.valueAmount);
				//get the entered amount of the current food from the array of name_amount pairs
				currEnteredAmount = parseFloat(name_amount[food.name]);
				//Calculate the amount of each nutrient per entered value
				//Calories
				currCalories = parseFloat(food.calories);
				currCalories *= (currEnteredAmount / typicalAmount); //calculate the calories in the entered amount
				calories += currCalories; //add to sum of calories

				//Carbs
				currCarbs = parseFloat(food.carbs);
				currCarbs *= (currEnteredAmount / typicalAmount);
				carbs += currCarbs;

				//Sugars
				currSugars = parseFloat(food.sugars);
				currSugars *= (currEnteredAmount / typicalAmount);
				sugars += currSugars;

				//Fat
				currFat = parseFloat(food.fat);
				currFat *= (currEnteredAmount / typicalAmount);
				fat += currFat;

				//Protein
				currProtein = parseFloat(food.protein);
				currProtein *= (currEnteredAmount / typicalAmount);
				protein += currProtein;

				//Salt
				currSalt = parseFloat(food.salt);
				currSalt *= (currEnteredAmount / typicalAmount);
				salt += currSalt;
				
			}
			client.close();
			//Make all values to 2 decimal places
			calories = calories.toFixed(2);
			carbs = carbs.toFixed(2);
			sugars = sugars.toFixed(2);
			fat = fat.toFixed(2);
			protein = protein.toFixed(2);
			salt = salt.toFixed(2);

			res.render('recipeInfo', { pageTitle: "Recipe", calories: calories, carbs: carbs, sugars: sugars, fat: fat, protein: protein, salt: salt });
		});
        });
});

//The Add Food Items page
app.get('/addFood',redirectLogin, (req,res) => {
	res.render('addFood', { pageTitle: "Add", err: null });
});

//The Food added route
app.post('/foodAdded', [check('name').trim().escape()], foodInDbs, function (req,res) { //Sanitize the name of the food and check if the food is already in the database
	//Connect to the database
	const MongoClient = require('mongodb').MongoClient;
       	const url = 'mongodb://localhost';
      	MongoClient.connect(url, function(err, client) {
        	if (err) throw err;
        	let db = client.db ('calorieBuddy'); 
		//Insert the food with all the data 
        	db.collection('food').insertOne({
        		name: req.body.name,
			valueAmount: req.body.valueAmount,
			unit: req.body.unit,
			calories: req.body.calories,
			carbs: req.body.carbs,
			sugars: req.body.sugars,
			fat: req.body.fat,
			protein: req.body.protein,
			salt: req.body.salt,
			creator: req.session.userId			
        	});
        	client.close();
		res.render('foodAdded', { pageTitle: "Success!", creator: req.session.userId, food: req.body.name, valueAmount: req.body.valueAmount, unit: req.body.unit, calories: req.body.calories, carbs: req.body.carbs, sugars: req.body.sugars, fat: req.body.fat, protein: req.body.protein, salt: req.body.salt });
        });
       });

//The Update food items page - first search
app.get('/updateFood-search', redirectLogin, function(req, res) {
	res.render('updateFood-search', {pageTitle: "Update"});
});
//The update food page - lists the food that was searched for on the updateFood-search page and has the option to update the data
app.get('/updateFood', function (req, res) {
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
        let keyword = req.query.search;
        MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                let db = client.db('calorieBuddy');
                let query = {$or:[ { name: keyword }, { name: {$regex:keyword, $options:"$i"} } ]}; //Find food with exact name as search or includes a part of it
                db.collection('food').find(query).sort({name: 1}).toArray((findErr, results) => {
                        if (findErr) {
                                console.log("ERROR loading update search");
                                res.redirect('./');
                        }
                        else {
				console.log("User updating: ", req.session.userId);
				res.render('updateFood', { pageTitle: "Search", foods:results, user: req.session.userId });
			}
                        client.close();
                });
        });
});

//The Food updated route
app.post('/foodUpdated', function (req, res) {
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
	const ObjectID = require('mongodb').ObjectID; 
        let objectId = { _id: ObjectID(req.body.objectId) }; //Find document based on its id
	//console.log("objectId ", objectId);
	let newValues = { $set: { name: req.body.name, valueAmount: req.body.valueAmount, unit: req.body.unit, calories: req.body.calories, carbs: req.body.carbs, sugars: req.body.sugars, fat: req.body.fat, protein: req.body.protein, salt: req.body.salt } }; //use all the new values
        MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                let db = client.db('calorieBuddy');
                db.collection('food').updateOne(objectId, newValues, (findErr, result) => {
                        if (findErr) {
                                console.log("ERROR loading food updated");
                                res.redirect('./');
                        }
                        else {
				//console.log("Successfully updated number of values: ", result.result.nModified);
				res.render('foodUpdated', { pageTitle: "Updated", numUpdate: result.result.nModified, name: req.body.name, valueAmount: req.body.valueAmount, unit: req.body.unit, calories: req.body.calories, carbs: req.body.carbs, sugars: req.body.sugars, fat: req.body.fat, protein: req.body.protein, salt: req.body.salt });
                        }
                        client.close();
                });
        });
});
//The Food deleted route
app.post('/foodDeleted', function (req, res) {
	console.log("delete Food Route!");
	const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
	const ObjectID = require('mongodb').ObjectID;
	let objectId = { _id: ObjectID(req.body.objectId) }; //Find document based on its id
	//console.log("objectId ", objectId);
	//console.log("name ", req.body.name);
	MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                let db = client.db('calorieBuddy');
		db.collection('food').deleteOne(objectId, (findErr, result) => { //delete the document based on its id
                        if (findErr) {
                                console.log("ERROR loading food updated");
                                res.redirect('./');
                        }
                        else {
				console.log("deleted number of items: ", result.deletedCount);
				console.log("successfully deleted ", req.body.name);
				res.render('foodDeleted', { pageTitle: "Deleted", name: req.body.name });
			}
			client.close();
		});
	});
});

//The Search food items page
app.get('/searchFood', function(req, res) {
	res.render('searchFood', {pageTitle: "Search"});
});

//The Search results route and page
app.get('/searchFood-result', function (req, res) {
	const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
	let keyword = req.query.search;
        MongoClient.connect(url, function (err, client) {
		if (err) throw err;
                let db = client.db('calorieBuddy');
		let query = {$or:[ { name: keyword }, { name: {$regex:keyword, $options:"$i"} } ]}; //Find food with exact name as search or includes a part of it
                db.collection('food').find(query).sort({name: 1}).toArray((findErr, results) => {
			if (findErr) {
				console.log("ERROR");
				res.redirect('./');
			}
			else res.render('searchFood-result', { pageTitle: "Search", foods:results });
                        client.close();
                });
        });
});

//The API routes
//GET all of the foods
app.get('/api', function (req, res) {
	const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
	MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                let db = client.db('calorieBuddy');
		db.collection('food').find().toArray((findErr, results) => {
			if (findErr) throw findErr;
			else {
				//console.log(results);
				res.json(results);
			}
			client.close();
		});
	});
});
//GET food by its name
app.get('/api/:food', function (req, res) {
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                let db = client.db('calorieBuddy');
		let query = { name: req.params.food  }; //find based on the name
                db.collection('food').find(query).toArray((findErr, results) => {
                        if (findErr) throw findErr;
                        else res.json(results);
                        client.close();
                });
        });
});
//PUT - update a food document
app.put('/api/:foodID', function (req, res) {
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
	const ObjectID = require('mongodb').ObjectID;
        let objectId = { _id: ObjectID(req.params.foodID) }; //Find the food based on its id
	let newValues = { $set: {
                        name: req.body.name,
                        valueAmount: req.body.valueAmount,
                        unit: req.body.unit,
                        calories: req.body.calories,
                        carbs: req.body.carbs,
                        sugars: req.body.sugars,
                        fat: req.body.fat,
                        protein: req.body.protein,
                        salt: req.body.salt,
                        creator: req.session.userId
                } }
        MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                let db = client.db('calorieBuddy');
		db.collection('food').updateOne(objectId, newValues, (findErr, result) => {
			if (findErr) throw findErr;
                        else res.json(result);
                        client.close();
		});
        });
});
//POST route - insert a food
app.post('/api', function (req, res) {
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                let db = client.db('calorieBuddy');
                db.collection('food').insertOne({
                        name: req.body.name,
                        valueAmount: req.body.valueAmount,
                        unit: req.body.unit,
                        calories: req.body.calories,
                        carbs: req.body.carbs,
                        sugars: req.body.sugars,
                        fat: req.body.fat,
                        protein: req.body.protein,
                        salt: req.body.salt,
                        creator: req.session.userId
                }, function (findErr, result) {
                        if (findErr) throw findErr;
                        else res.json(result);
                        client.close();
                });
        });
});
//DELETE route - delete a food based on its _id
app.delete('/api/:foodID', function (req, res) {
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost';
        const ObjectID = require('mongodb').ObjectID;
        let objectId = { _id: ObjectID(req.params.foodID) }; //Find the food based on its id
	MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                let db = client.db('calorieBuddy');
                db.collection('food').deleteOne(objectId, (findErr, result) => { //delete the document based on its id
			if (findErr) throw findErr;
                        else res.json(result);
                        client.close();
                });
        });
});

//Last line before closing the main function
};

