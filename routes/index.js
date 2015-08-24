//var db = require('../models')
var db = app.db;

exports.index = function(req, res) {
  db.Customer.findAll({
    include: [ db.Task]
  }).success(function(customers) {
    res.render('index', {
      title: 'Express',
      customers: customers
    })
  })
}