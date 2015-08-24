/**
 * Created by monty on 19/05/15.
 */
module.exports = function (app) {

    var db = app.db;
    var secret = app.secret;
    var P = app.Promise;

    var util = require('../util');
    var dao = require('../dao')(app);

        return {
            create: function (req, res) {
                util.checkParams(req.body, ['total_price', 'status', 'start_time', 'finish_time','home_deliveri']);
                var attribs = {
                    total_price: req.body.total_price,
                    status: req.body.status,
                    start_time: req.body.start_time,
                    finish_time: req.body.finish_time,
                    home_deliveri: req.body.home_deliveri
                }

                db.sequelize.transaction(function (t) {
                    return dao.Charge.create(attribs, t);
                })
                    .then(util.jsonResponse.bind(util, res))
                    .catch(util.resendError.bind(util, res))
                    .done();
            }
        }










}