/**
 * Created by monty on 16/04/15.
 */
module.exports = function (app) {

 var jwt = require('express-jwt')({secret: app.secret});

 var Customers = require('./routes/r_customer')(app);
 var Businesses = require('./routes/r_business')(app);

 var util = require('./util');

 // Customer login
 app.post('/api/customers/login', Customers.login);//OK

 //app.get('/api/customers/logout',jwt, Customers.logout);
 // Customer registration
 app.post('/api/customers', Customers.create);//OK
//Customer POST
 app.post('/api/customers/self/address',jwt,Customers.addAddress);//OK

 app.post('/api/customers/self/charge', jwt,Customers.new_charge);//OK


//Customer PUT
 app.put('/api/customers/self/password',jwt,Customers.change_password);//OK

 app.put('/api/customers/self',jwt,Customers.change_data);//OK

//Customer GET
 app.get('/api/customers/self/addresses',jwt,Customers.getAddresses);//OK

 app.get('/api/customers/self/business/charges', jwt, Customers.getChargesBusiness);//OK

 app.get('/api/customers/self/charges',jwt,Customers.getAllCharges);//OK

 app.get('/api/business/:id/category',jwt,Customers.getBusinessCat);//OK

 app.get('/api/category/:id/products',jwt,Customers.getCatProducts);//OK

 app.get('/api/business/:id/address',jwt,Customers.getBusinessAddress);//OK

 //app.post('/api/business/:id/relationship', jwt, Customers.relationship);

 // Business login
 app.post('/api/businesses/login', Businesses.login);//OK

 //Business registration
 app.post('/api/businesses', Businesses.create);//OK

//Business POST
 app.post('/api/businesses/self/address',jwt,Businesses.addAddress);//OK

 app.post('/api/businesses/self/category',jwt,Businesses.new_Category);//OK

 app.post('/api/businesses/self/category/product',jwt,Businesses.new_Product);//OK

 //Business PUT

 //Business GET
 app.get('/api/businesses', jwt, Businesses.getBusinesses);//OK

 app.get('/api/businesses/self/addresses',jwt,Businesses.getAddresses);//OK

 app.get('/api/businesses/self/customers', jwt,Businesses.getBusinessCustomers);//OK
 // Only if Business is logged in
 app.get('/api/businesses/:id', Businesses.getBusinessById);//OK

 app.get('/api/businesses/self/categories',jwt,Businesses.getBusinessCategories);//OK

 app.get('/api/businesses/self/category/products',jwt,Businesses.getCategoryProducts);//OK

 }