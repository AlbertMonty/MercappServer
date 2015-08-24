/**
 * Created by monty on 14/05/15.
 */
module.exports = function (app) {
    var db = app.db;

    var Category={}

    var util = require('../util');

    Category.create = function (category_data, business,t) {
        return db.Category.create(category_data, util.addTrans(t, {}))
            .then(function(category){
                category.setBusiness(business,util.addTrans(t,{}))
            });
    }
    Category.getById=function(id,t){
        return db.Category.find(util.addTrans(t,{where:{id:id}}));
    }
    Category.getByBusiness= function(business,t){
        console.log("aqui al dao de category")
        return db.Category.findAll(util.addTrans(t,{where:{businessId:business.id}})) // FIXME: findAll not Find
    }

    return Category;
}