/**
 * Created by monty on 17/04/15.
 */
module.exports = function (app) {
    var db= app.db;

    var Charge_line={}

    var util = require('../util');

    Charge_line.create = function (charge_line_data, t) {
        return db.Charge_line.create(charge_line_data, util.addTrans(t, {}));
    }

    return Charge_line;
}