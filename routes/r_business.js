/**
 * Created by monty on 14/05/15.
 */
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
    v.addSchema(schemas.businessSchema,'/Business')
    v.addSchema(schemas.categorySchema,'/Category')
    v.addSchema(schemas.productSchema,'/Product')
    v.addSchema(schemas.addressSchema,'/Address')


    return {
        login: function (req, res) {
            util.checkParams(req.body, ['name', 'password']);
            dao.Business.checkPassword(req.body.name, req.body.password)
                .then(function (business) {
                    var token = jwt.sign({name: business.name}, secret);
                    util.jsonResponse(res, {jwt: token, name: business.name});
                })
                .catch(util.resendError.bind(util, res))
                .done();
        },

        create: function (req, res) {
            console.log("routes")
            //util.checkParams(req.body, ['email', 'name', 'password', 'phone_number', 'description', 'facebook_link']);
            v.validate(req.body,schemas.businessSchema);
            var attribs = {
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password),
                phone_number: req.body.phone_number,
                description: req.body.description,
                facebook_link: req.body.facebook_link
            }

            db.sequelize.transaction(function (t) {
                return P.all([
                    dao.Business.getByEmail(req.body.email, t),
                    dao.Business.getByName(req.body.name, t)
                ])
                    .spread(function (s1, s2) {
                        if (!s1 && !s2) {
                            return dao.Business.create(attribs, t);
                        } else if (s1) {
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, "Already exist a Business with email = " + req.body.email);
                        } else {
                            util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "Already exist a Business with name = " + req.body.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getBusinesses: function(req,res){
            dao.Business.getAll()
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getBusinessCustomers: function(req,res){
            db.sequelize.transaction(function (t) {
                return dao.Business.getByName(req.user.name,t)
                    .then(function(business){
                        if(business){
                            return dao.Business.getBusinessCustomers(business,t)
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found " + req.user.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getBusinessById: function(req,res){
            dao.Business.getById(req.body.id, {})
                    .then(util.jsonResponse.bind(util, res))
                    .catch(util.resendError.bind(util, res))
                    .done();

        },
        getBusinessCategories: function(req,res){
            db.sequelize.transaction(function(t) {
                return dao.Business.getByName(req.user.name, t)
                    .then(function (business) {
                        if (business) {
                            return dao.Category.getByBusiness(business, t)
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found " + req.user.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getCategoryProducts:function(req,res){
            db.sequelize.transaction(function(t){
                return dao.Business.getByName(req.user.name, t)
                    .then(function(business){
                        if(business){
                            return dao.Category.getByBusiness(business,t)
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found " + req.user.name);
                        }
                    }).then(function (catList) {
                        var categoryList = []
                        catList.forEach(function(category){
                            categoryList.push(dao.Product.getAllByCategory(category, t))
                        })
                        return P.all(categoryList);
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        getAddresses:function(req,res){
            db.sequelize.transaction(function(t){
                return dao.Business.getByName(req.user.name,t)
                    .then(function(business){
                        return dao.Business.getAddress(business,t)
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        new_Category:function(req,res){
            v.validate(req.body.category,schemas.categorySchema);
            console.log("new category business route")
            db.sequelize.transaction(function(t){
                var attribs = {
                    name:req.body.category.name,
                    def:req.body.category.def
                }
                return dao.Business.getByName(req.user.name, t)
                    .then(function(business){
                        if(business){
                            return dao.Category.create(attribs,business,t)
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found " + req.user.name);
                        }
                    })

            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();

        },
        new_Product:function(req,res){
            v.validate(req.body.product,schemas.productSchema);
            db.sequelize.transaction(function(t){
                var attribs = {
                    name : req.body.product.name,
                    units :req.body.units,
                    unit_price :req.body.product.unit_price,
                    seasonal : req.body.product.seasonal,
                    description : req.body.product.description
                }
                return P.all([
                    dao.Business.getByName(req.user.name, t),
                    dao.Category.getById(req.body.categoryId,t)
                ])
                    .spread(function(business,category){
                        if(business && category){
                            return dao.Product.create(attribs,category,t)
                        }else if(!category){
                            util.throwError(400,util.Error.ERR_ENTITY_NOT_FOUND," that category doesn't exist");
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found " + req.user.name);
                        }
                    })

            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();
        },
        addAddress:function(req,res){
            v.validate(req.body.address,schemas.addressSchema);
            db.sequelize.transaction(function(t){
                var attribs={
                    street: req.body.address.street,
                    number: req.body.address.number,
                    city: req.body.address.city,
                    post_code: req.body.address.post_code,
                    floor: req.body.address.floor,
                    door: req.body.address.door
                }
                return dao.Business.getByName(req.user.name,t)
                    .then(function(business){
                        if(business){
                           return dao.Business.createAddress(business,attribs,t);
                        }else{
                            util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, " business not found " + req.user.name);
                        }
                    })
            })
                .then(util.jsonResponse.bind(util, res))
                .catch(util.resendError.bind(util, res))
                .done();

        }
    }
}