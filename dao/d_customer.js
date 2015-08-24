/**
 * Created by monty on 17/04/15.
 */
/**
 * New node file
 */


module.exports = function (app) {
    var db = app.db;
    var Customer = {};

    var util = require('../util');

    var bcrypt = require('bcrypt-nodejs');

    Customer.checkPassword = function (name, password, t) {
        return Customer.getByName(name, t)
            .then(function (customer) {
                if (customer) {
                    if (bcrypt.compareSync(password, customer.password)) {
                        return customer;
                    } else {
                        util.throwError(400, util.Error.ERR_AUTHENTICATION, "Invalid password");
                    }
                } else {
                    util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, "There is no Customer with name: " + name);
                }
            });
    };

    Customer.getById = function (id,t){
        return db.Customer.find(util.addTrans(t,{where: {id:id}}));
    }

    Customer.getByName = function (name, t) {
        return db.Customer.find(util.addTrans(t, {where: {name: name}}));
    }

    Customer.getByEmail = function (email, t) {
        return db.Customer.find(util.addTrans(t, {where: {email: email}}));
    }

    Customer.create = function (customer_data, t) {
        return db.Customer.create(customer_data, util.addTrans(t, {}));
    }

    Customer.getAddresses= function(customer,t){
        return db.Address.findAll(util.addTrans(t,{where:{CustomerId:customer.id}}))
    }

    return Customer;
}