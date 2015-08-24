/**
 * Created by monty on 28/04/15.
 */
module.exports = function(app){
    var dao = {};

    dao.Customer = require('./d_customer')(app, dao);
    dao.Business = require('./d_business')(app, dao);
    dao.Charge = require('./d_charge')(app, dao);
    dao.Charge_line = require('./d_charge_line')(app, dao);
    dao.Address = require('./d_address')(app, dao);
    dao.Category = require('./d_category')(app, dao);
    dao.Product = require('./d_product')(app, dao);

    return dao;
};