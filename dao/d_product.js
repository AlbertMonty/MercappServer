/**
 * Created by monty on 14/05/15.
 */
module.exports = function (app) {
    var db = app.db;
    var Product = {}

    var util = require('../util');

    Product.create = function(product_data,category,t){
        return db.Product.create(product_data, util.addTrans(t, {}))
            .then(function(product){
                product.setCategory(category,util.addTrans(t,{}))
            });
    }
    Product.getAllByCategory= function(category,t){
        return db.Product.findAll(util.addTrans(t,{where:{CategoryId:category.id}}))
    }

    Product.getById = function(id,t){
        return db.Product.find(util.addTrans(t,{where:{id:id}}))
    }

    return Product;
}