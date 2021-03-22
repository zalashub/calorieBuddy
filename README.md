# README

## Requirement list

#### R1: Homepage - views/index.ejs

**views/index.ejs Title on line 5 and Welcome messages lines 17-18** R1A: Display the name of the web application.
**views/index.ejs line 10 - include the header partial from views/partials/header.ejs which contains the navigation** R1B:  Display links to other pages or a navigation bar that contains links to other pages.

#### R2: About page - views/about.ejs

**views/about.ejs lines 14-18 and line 9 which includes the header partial from views/partials/header.ejs which contains the navigation** R2A: Display information about the web application including your name as the developer. Display a link to the home page or a navigation bar that contains links to other pages.

#### R3: Register page - views/register.ejs 

**views/register.ejs lines 17-79 and line 9 which includes the header partial from views/partials/header.ejs which contains the navigation** R3A: Display a form to users to add a new user to the database. The form should consist of the following items: first name, last name, email address, username, and passwor. Display a link to the home page or a navigation bar that contains links to other pages.

**routes/main.js lines 124-189** R3B: Collect form data to be passed to the back-end (database) and store user data in the database. Each user data consists of the following fields: first name, last name, email address, username and password. To provide security of data in storage, a hashed password should only be saved in the database, not a plain password.

**displays views/registered.ejs** R3C: Display a message indicating that add operation has been done.

#### R4: Login page - views/login.ejs

**views/login.ejs lines 22-44 and line 9 which includes the header partial from views/partials/header.ejs which contains the navigation** R4A: Display a form to users to log in to the dynamic web application. The form should consist of the following items: username and password.  Display a link to the home page or a navigation bar that contains links to other pages.

**routes/main.js lines 191-260** R4B: Collect form data to be checked against data stored for each registered user in the database. Users are logged in if and only if both username and password are correct.

**views/loggedin.ejs if successful and re-render views/login.ejs lines 31-39 with appropriate messages if not – controlled in routes/main.js lines 219-224 and lines 239-252** R4C: Display a message indicating whether login is successful or not and why not successful.

#### R5: Logout - views/logout.ejs

**routes/main.js lines 263-270 and views/logout.ejs** There is a way to logout, a message is displayed upon successful logout.

#### R6: Add food page (only available to logged-in users) - views/addFood.ejs

**views/addFood.ejs** R6A: Display a form to users to add a new food item to the database. The form should consist of the following items: name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar.  Display a link to the home page or a navigation bar that contains links to other pages. 

**routes/main.js lines 423-470 with saving the creator on line 452** R6B: Collect form data to be passed to the back-end (database) and store food items in the database. Each food item consists of the following fields: name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar. Going beyond by saving the username of the user who has added this food item to the database.

**displays views/foodAdded.ejs (from routes/main.js lines 455-466)** R6C: Display a message indicating that add operation has been done.

#### R7: Search food page - views/searchFood.ejs 

**views/searchFood.ejs** R7A: Display a form to users to search for a food item in the database. 'The form should contain just one field - to input the name of the food item'. Display a link to the home page or a navigation bar that contains links to other pages.

**routes/main.js lines 588-619 with results at views/searchFood-results.ejs with the message not found at views/searchFood-results.ejs lines 16-19** R7B:  Collect form data to be passed to the back-end (database) and search the database based on the food name collected from the form. If food found, display a template file (ejs, pug, etc) including data related to the food found in the database to users; name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar. Display a message to the user, if not found.

**routes/main.js line 602** R7C: Going beyond, search food items containing part of the food name as well as the whole food name. As an example, when searching for ‘bread’ display data related to ‘pitta bread’, ‘white bread’, ‘wholemeal bread’, and so on.

#### R8: Update food page (only available to logged-in users) - views/updateFood-search.ejs

**views/updateFood-search.ejs** R8A: Display search food form. Display a link to the home page or a navigation bar that contains links to other pages. 

**views/updateFood.ejs** R8B: If food found, display data related to the food found in the database to users including name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar in forms so users can update each field. 

**views/updateFood.ejs line 16-19** Display a message to the user if not found. 

**routes/main.js liens 509-558** Collect form data to be passed to the back-end (database) and store updated food items in the database. 

**display views/foodUpdated.ejs from routes/main.js lines 540-551** Display a message indicating the update operation has been done.

**checked (and form disabled) in views/updateFood.ejs line 29** You can go beyond this requirement by letting ONLY the user who created the same food item update it.

**done in views/updateFood.ejs lines 142-159 and deleting in routes/main.js lines 559-585 with successful message displayed with views/foodDeleted.ejs** R8C: Implement a delete button to delete the whole record, when the delete button is pressed, it is good practice to ask 'Are you sure?' and then delete the food item from the database, and display a message indicating the delete has been done. 

**checked in the same way as the updating in R8B in views/updateFood.ejs line 29** You can go beyond this requirement by letting ONLY the user who created the same food item delete it.

#### R9: List food page (available to all users) - views/foodList.ejs 

**views/foodList.ejs** R9A: Display all foods stored in the database including name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar, sorted by name. Display a link to the home page or a navigation bar that contains links to other pages.

**tabular format in views/foodList.ejs lines 22-69** R8B: You can gain more marks for your list page is organised in a tabular format instead of a simple list. 

**views/foodList.ejs lines 20, 49-63 and 71-72** R9C: going beyond by letting users select some food items (e.g. by displaying a checkbox next to each food item and letting the user input the amount of each food item in the recipe e.g. 2x100 g flour)

**calculated values in routes/main.js lines 292-421 and displayed views/recipeInfo.ejs** Then collect the name of all selected foods and calculate the sum of the nutritional information (calories, carbs, fat, protein, salt, and sugar) related to all selected food items for a recipe or a meal and display them as ‘nutritional information and calorie count of a recipe or a meal’. Please note, it is not necessary to store recipes or meals in the database.

#### R10: API - routes/main.js 621-642

**routes/main.js 621-642** There is a basic API displayed on '/api' route listing all foods stored in the database in JSON format. i.e. food content can also be accessed as JSON via HTTP method, It should be clear how to access the API (this could include comments in code).

**routes/main.js 643-752** Additional credit will be given for an API that implements get, post, push and delete.

#### R11: form validation 

**implemented in routes/main.js lines 128-139, 432, 433 with additional custom validators on lines 8-79 and more validation done with the help of HTML attributes on every form input** All form data should have validations, examples include checking password length, email validation, integer data is integer and etc. 

#### R12: Using Node.js on the VS with MongoDB back-end

**setup in index.js, using MongoDB** Your dynamic web application must be implemented in Node.js on your virtual server. The back-end of the web application could be MongoDB or MySQL.

---

## Highlights - additional features that I added


- **Custom validator** to check whether an **email** is **already registered:** *main.js from line 8*
- **Custom validator** to check whether **username** is **already taken:** *main.js from line 33*
- **Custom validator** to check whether a **food item** is **already in the database:** *main.js from line 58*
- **Redirect route** when **user** is already **logged in** and they want to access the **login** or **register** page: *main.js from line 97*
- **Recipe calculation:** *main.js line 293 to 421*
- Sending **custom data parameters** to each EJS template to render it appropriately (specifically various forms that need to be rendered differently, depending on whether the user entered all the data correctly or not) 
- **Sanitizing and validating** every form input: *main.js lines 128-139, 432, 433*
- Making all **fields** when registering or adding a food **required** and controlled that they are of the **right type** 
- **POST, PUT and DELETE API routes and custom GET API** route: *main.js lines 621-752*
- Added EJS template **partials** for the head, header and footer so to easily include the common elements (e.g. navigation) on all pages 
- Set up **serving static assets** such as images from the “public” directory: *index.js line 37*
- Used **Bootstrap** framework throughout the application, learning it along the way (was my first time using it) 
- **Table** of all of the **food items with the individual checkboxes and input** fields: *views/foodList.ejs lines 49-63* 
- **Invalid feedback custom messages:** *views/addFood.ejs lines 23-25; views/login.ejs lines 31-39; views/register.ejs lines 23-24, 29-30, 39-40, 55-56, 64-65*
- **“help tips”** below input fields so the user knows what they need to enter in the form: *views/register.ejs lines 41, 59, 66*
- Agree to **“terms and conditions”** condition when the user registers: *views/register.ejs lines 71-76*
- **different rendering** based on whether the user is logged in or not: *views/login.ejs lines 14-20 or depending on the amount of search results views/searchFood-results.ejs lines 16-19 and views/updateFood.ejs lines 16-19*
- Creating a **form for each found food** when the user searches for a food to update: *views/updateFood.ejs lines 25-139, disabling the form in case the user it not the creator of the food line 29 with notes stating that line 134, making the modal asking “are you sure” when the user tries to delete the food lines 142-159*
- **Multiple submit buttons** (either update or confirm delete), each POSTing to different routes: *views/updateFood.ejs line 154* 
- **Serve image** on main page: *views/index.ejs line 15*
- Adding **more units** for the typical values for food items

---

## Database model details and ERD

The Calorie Buddy dynamic web application uses **MongoDB** to store and perform CRUD operations on the data.

The name of the database is `calorieBuddy` with the two collections being `users` and `food`. 

The `users` collection stores all the data about the registered users, such as first `"name"`, `"lastName"`, `"email"`, `"username"` and a hashed `"password"`, and of course the **primary key** `_id` generated automatically by MongoDB.

The `food` collection stores all the food items that were added to the database. It includes the following fields: **primary key** `_id`, `"name"`, `"valueAmount"` for the typical amount of the food (e.g. 100 \[grams\]), `"unit"` for the unit of the typical values (gram, miligram, tablespoon, liter, etc.), `"calories"`, `"carbs"`, `"sugars"`, `"fat"`, `"protein"`, `"salt"` and `"creator"` to store the username of the user who added the partial food in the database. The `"creator"` field is thus a **foreign key** and a **reference** to the `"username"` field in the `users` collection.

The relationship between the `food` collection and the `users` collection is thus many to one. 

The visual representation aka the Entity Relationship diagram can be seen below.

\ ![Calorie Buddy Entity Relationship diagram](/calorie-buddy-erd.jpg "Entity Relationship diagram")

---

## API instructions

#### GET ROUTE - get all of the foods 

- from the browser just type in **<http://doc.gold.ac.uk/usr/401/api>** to retrieve all of the food items in the database 
- Using curl type: `curl -i www.doc.gold.ac.uk/usr/401/api` in the terminal 

#### Custom GET ROUTE - get food by its name 

- from the browser just type in **<http://doc.gold.ac.uk/usr/401/api/foodName>** replacing `foodName` with the name of the food item to retrieve it 
- using curl type: `curl -i www.doc.gold.ac.uk/usr/401/api/foodName` in the terminal (again replacing `foodName` with the desired item name) 
    - e.g. `curl -i www.doc.gold.ac.uk/usr/401/api/Banana`

#### PUT ROUTE - update a food document 

- type the following in the terminal, replacing `foodID` with the `_id` of the object whose properties you're trying to update and replace the `property` with the property name
    - e.g. `"name"` or `"calories"`, and the "newValue" with the value 
- `curl -d '{"property": "newValue"}' -H 'Content-Type: application/json' -X PUT www.doc.gold.ac.uk/usr/401/api/foodID`
    - e.g. `curl -d '{"sugars": "8"}' -H 'Content-Type: application/json' -X PUT www.doc.gold.ac.uk/usr/401/api/605326e8d3d8cd6f440cb0b1`

#### POST ROUTE - insert a food 

- in the terminal type the following, replacing the `body` with the key-value pairs for the properties of the document (food item) you wish to insert 
- note: you do not need to include the `_id` property, as MongoDB generates it automatically 
- `curl -i -X POST -d '{body}' -H 'Content-Type: application/json' www.doc.gold.ac.uk/usr/401/api` 
    - e.g. for *banana*: `curl -i -X POST -d '{ "name":"Banana", "valueAmount":"100", "unit":"grams", "calories":"88", "carbs":"23", "sugars":"12", "fat":"0.3", "protein":"1.1", "salt":"1", "creator": "yourUsername"}' -H 'Content-Type: application/json' www.doc.gold.ac.uk/usr/401/api`

#### DELETE ROUTE - delete a food based on its _id 

- type the following in the terminal, replacing `foodID` with the `_id` of the object you wish to delete 
- `curl -X DELETE www.doc.gold.ac.uk/usr/401/api/foodID`
    - e.g. `curl -X DELETE www.doc.gold.ac.uk/usr/401/api/605326e8d3d8cd6f440cb0b1`
