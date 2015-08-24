/**
 * Created by monty on 17/04/15.
 */
module.exports = function (app, dao) {
    var db = app.db;
    var Charge={}
    var util = require('../util');
    var P = app.Promise;


    Charge.getCtmrBsnsCharges = function(customer,business,t){
        return db.Charge.findAll(util.addTrans(t,{where: {BusinessId:business.id, CustomerId:customer.id}}))
    }

    Charge.getBusinessCharges= function(business,t){
        return db.Charge.findAll(util.addTrans(t,{where: {BusinessId:business.id}}))
    }

    Charge.getCustomerCharges = function(customer,t){
        return db.Charge.findAll(util.addTrans(t,{where:{CustomerId:customer.id}}))
    }
    Charge.getChargeById = function(id,t){
        return db.Charge.find(util.addTrans(t,{where:{id:id}}))
    }

    Charge.createDeliveriCharge = function (charge_data,customer,business, address, t){
        return db.Charge.create(charge_data, util.addTrans(t, {}))
            .then(function(charge) {
                return charge.setCustomer(customer, util.addTrans(t, {}))
            })
            .then(function(charge){
                return charge.setBusiness(business,util.addTrans(t,{}))
            })
            .then(function(charge){
                return charge.setAddress(address,util.addTrans(t,{}))
            })
    }

    Charge.createNoDeliveriCharge = function (charge_data,customer,business, t){
        return db.Charge.create(charge_data, util.addTrans(t, {}))
            .then(function(charge) {
                return charge.setCustomer(customer, util.addTrans(t, {}))
            })
            .then(function(charge){
                return charge.setBusiness(business,util.addTrans(t,{}))
            })
    }


    Charge.createLines = function(array, charge, t){
        var p = [],attribs;
        array.forEach(function(ch_line){
            attribs = {
                quantity: ch_line.quantity,
                price: ch_line.price
            }
            p.push(dao.Charge.createCh_line_withProduct(attribs,ch_line.productId,t))

        })
        var ps=[]
        p.forEach(function(myPromise){
            myPromise.then(function(ch_line){
                ps.push(charge.addCharge_line(ch_line,util.addTrans(t,{})))
            })
        })
        return P.all(ps);
    }

    Charge.createCh_line_withProduct= function(ch_line_data, productId, t){
        return P.all([
            db.Charge_line.create(ch_line_data,util.addTrans(t,{})),
            db.Product.find(util.addTrans(t,{where:{id:productId}}))
        ])
            .spread(function(charge_line,product){
                return charge_line.setProduct(product,util.addTrans(t,{}))
            })
    }

    return Charge;
}