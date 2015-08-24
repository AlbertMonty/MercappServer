/**
 * Created by monty on 29/04/15.
 */
module.exports = function (app) {

    var db = app.db;
    var secret = app.secret;
    var P = app.Promise;

    var util = require('../util');
    var dao = require('../dao')(app);
    var bcrypt = require('bcrypt-nodejs');
    var jwt = require('jsonwebtoken');

    var Validator = require('jsonschema').Validator;
    var schemas = require('../validator/v_validator');
    var v = new Validator();
    v.addSchema(schemas.customerSchema,'/Customer');
    v.addSchema(schemas.chargeSchema,'/Charge');
    v.addSchema(schemas.charge_lineSchema,'/Charge_Line');
    v.addSchema(schemas.addressSchema,'/Address');



    return {
        login: function (req, res) {
            util.checkParams(req.body, ['name', 'password']);
            dao.Customer.checkPassword(req.body.name, req.body.password)
                .then(function (customer) {
                    var token = jwt.sign({name: customer.name}, secret);
                    util.jsonResponse(res, {jwt: token, customer: customer});
                })
                .catch(util.resendError.bind(util, res))
                .done();
        },
        create: function (req, res) {
            console.log(req.body);
            v.validate(req.body,schemas.customerSchema);
            var attribs = {
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password),
                phone_number: req.body.phone_number
            }

            db.sequelize.transaction(function (t) {
                return P.all([
                    dao.Customer.getByEmail(req.body.email, t),
                    dao.Customer.getByName(req.body.name, t)
                ])
                    .spread(function (s1, s2) {
                        if (!s1 && !s2) {
                            return dao.Customer.create(attribs, t);
                        } else if (s1) {
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, "Already exist a Customer with email = " + req.body.email);
                        } else {
                            util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "Already exist a Customer with name = " + req.body.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        new_charge: function(req,res){

            v.validate(req.body,schemas.newChargeSchema);
            return db.sequelize.transaction(function(t){
                var attribs = {
                    total_price: req.body.total_price,
                    status: req.body.status,
                    start_time: req.body.start_time,
                    finish_time: req.body.finish_time,
                    home_deliveri: req.body.home_deliveri
                }
                return P.all([
                    dao.Business.getById(req.body.businessId, t),
                    dao.Customer.getByName(req.user.name, t)
                ])
                    .spread(function(business,customer){
                        if(business && customer){
                            if(attribs.home_deliveri){
                                return P.all([
                                    business,
                                    customer,
                                    dao.Address.getById(req.body.addressId,t),
                                    dao.Business.hasCustomer(business, customer, t)
                                ])
                            }else{
                                return P.all([
                                    business,
                                    customer,
                                    undefined,
                                    dao.Business.hasCustomer(business, customer, t)
                                ])
                            }

                        }else if (!business) {
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found " + req.params.id);
                        } else {
                            util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "customer not found = " + req.user.name);
                        }
                    })
                    .spread(function(business,customer,address,relationship){
                        if(relationship.length == 0) {
                                customer.addBusiness(business,util.addTrans(t,{}))
                        }
                        if(address){
                            return dao.Charge.createDeliveriCharge(attribs, customer, business, address,t)
                        }else{
                            return dao.Charge.createNoDeliveriCharge(attribs, customer, business,t)
                        }
                    })
                    .then(function(charge,t){
                        console.log("charge created going to create lines")
                        return dao.Charge.createLines(req.body.lines,charge,t)
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        change_password : function(req,res){
            db.sequelize.transaction(function() {
                return dao.Customer.checkPassword(req.body.name, req.body.password)
                    .then(function (customer) {
                        if (customer) {
                            customer.password = bcrypt.hashSync(req.body.new_password);
                            return customer.save()

                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "customer not found = " + req.user.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        change_data : function(req,res){
            v.validate(req.body,schemas.customerSchema);
            db.sequelize.transaction(function(){
                return dao.Customer.checkPassword(req.body.name, req.body.password)
                    .then(function(customer){
                        if (customer){
                            customer.name=req.body.new_name;
                            customer.email=req.body.new_email;
                            customer.phone_number=req.body.new_phone_number;
                            return customer.save();
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "customer not found = " + req.user.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getChargesBusiness: function(req,res){
            db.sequelize.transaction(function(t) {
                return P.all([
                    dao.Business.getById(req.query.bId, t),
                    dao.Customer.getByName(req.user.name, t)
                ])
                    .spread(function(business,customer){
                        if(business && customer){
                            return dao.Charge.getCtmrBsnsCharges(customer,business,t);
                        }else if (!business) {
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found " + req.params.id);
                        } else {
                            util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "customer not found = " + req.user.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getAllCharges: function(req,res) {
            db.sequelize.transaction(function(t) {
                return dao.Customer.getByName(req.user.name, t)
                    .then(function (customer) {
                        if (customer) {
                            return dao.Charge.getCustomerCharges(customer, t);
                        } else {
                            util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "customer not found = " + req.user.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getBusinessCat:function(req,res){
            db.sequelize.transaction(function(t){
                return dao.Business.getById(req.params.id,t)
                    .then(function(business){
                        if(business) {
                            return dao.Category.getByBusiness(business, t)
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found ");
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getCatProducts: function(req,res){
            db.sequelize.transaction(function(t){
                return dao.Category.getById(req.params.id,t)
                    .then(function(category){
                        if(category){
                            return dao.Product.getAllByCategory(category,t);
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " category not found ");
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();

        },
        getAddresses:function(req,res){
            db.sequelize.transaction(function(t){
              return dao.Customer.getByName(req.user.name,t)
                  .then(function(customer){
                      return dao.Customer.getAddresses(customer,t)
                  })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getBusinessAddress:function(req,res){
            db.sequelize.transaction(function(t){
                return dao.Business.getById(req.params.id,t)
                    .then(function(business){
                        return dao.Business.getAddress(business,t)
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        addAddress:function(req,res){
            v.validate(req.body,schemas.addressSchema);
            return db.sequelize.transaction(function(t){
                var attribs={
                    street: req.body.street,
                    number: req.body.number,
                    city: req.body.city,
                    post_code: req.body.post_code,
                    floor: req.body.floor,
                    door: req.body.door
                }
                return dao.Customer.getByName(req.user.name,t)
                    .then(function(customer){
                        if(customer){
                            return P.all([
                                customer,
                                dao.Address.create(attribs,t)
                            ])
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "customer not found = " + req.user.name);
                        }
                        console.log("address created and added to the customer...")
                    })
                    .spread(function(customer,address){
                            return customer.addAddress(address,util.addTrans(t,{}));
                    })
                    .then(function(customer){
                        return dao.Customer.getAddresses(customer,t);
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        }

    }
}