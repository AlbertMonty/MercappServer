/**
 * Created by monty on 17/04/15.
 */
/**
 * New node file
 */


module.exports = function (app) {
    var db = app.db;
    var Business = {};

    var util = require('../util');
    var bcrypt = require('bcrypt-nodejs');

    Business.checkPassword = function (name, password, t) {
        return Business.getByName(name, t)
            .then(function (business) {
                if (business) {
                    if (bcrypt.compareSync(password, business.password)) {
                        return business;
                    } else {
                        util.throwError(400, util.Error.ERR_AUTHENTICATION, "Invalid password");
                    }
                } else {
                    util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, "There is no Business with name: " + username);
                }
            });
    };

    Business.getById = function(id,t){
        return db.Business.find(util.addTrans(t,{where:{id:id}}));
    }

    Business.getByName = function (name, t) {
        return db.Business.find(util.addTrans(t, {where: {name: name}}));
    }

    Business.getByEmail = function (email, t) {
        return db.Business.find(util.addTrans(t, {where: {email: email}}));
    }

    Business.create = function (business_data, t) {
        return db.Business.create(business_data, util.addTrans(t, {}));
    }

    Business.getAll = function(t){
        return db.Business.findAll(util.addTrans(t,{}));
    }

    Business.getBusinessCustomers = function(business, t){
        return business.getCustomers(util.addTrans(t,{}));
    }

    Business.getAddress = function(business,t){
        return db.Address.find(util.addTrans(t,{where:{BusinessId:business.id}}))
    }

    Business.hasCustomer = function (business, customer, t) {
        return business.getCustomers(util.addTrans(t, {where: {id: customer.id}}))
    }

    Business.createAddress=function(business,address_data,t){
        return db.Address.create(address_data,util.addTrans(t,{}))
            .then(function(address){
                return business.setAddress(address)
            })
    }
    return Business;
}