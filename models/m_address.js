/**
 * Created by monty on 17/04/15.
 */

module.exports = function(sequelize, Datatypes){
    var Address = sequelize.define('Address', {
        street: Datatypes.STRING(100),
        number: Datatypes.INTEGER,
        city: Datatypes.STRING(50),
        post_code: Datatypes.INTEGER,
        floor: Datatypes.INTEGER,
        door: Datatypes.STRING(10)
    },{
        classMethods: {
            associate: function (models) {
                Address.belongsTo(models.Customer)
                Address.belongsTo(models.Business)
                Address.hasMany(models.Charge)
            }
        }
    });
    return Address;
};

