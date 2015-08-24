/**
 * Created by monty on 17/04/15.
 */
module.exports = function (app) {
    var db = app.db;
    var Address ={}
    var util = require('../util');

    Address.create=function(address_data,t){
        return db.Address.create(address_data, util.addTrans(t, {}));
    }

    Address.getById=function(id,t){
        return db.Address.find(util.addTrans(t, {where:{id:id}}))
    }


    return Address;
}