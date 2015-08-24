/**
 * Created by monty on 14/04/15.
 */
module.exports = function(sequelize, DataTypes) {
    var Charge = sequelize.define('Charge', {
        total_price: DataTypes.FLOAT,
        status: DataTypes.STRING(255),
        start_time: DataTypes.DATE,
        finish_time: DataTypes.DATE,
        home_deliveri: DataTypes.BOOLEAN
    },{
        classMethods : {
            associate : function(models) {
                Charge.belongsTo(models.Customer)
                Charge.belongsTo(models.Business)
                Charge.belongsTo(models.Address)
                Charge.hasMany(models.Charge_line)
            }}
    });

    return Charge;
};
