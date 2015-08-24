/**
 * Created by monty on 16/04/15.
 */
module.exports = function(sequelize, DataTypes) {
    var Charge_line = sequelize.define('Charge_line', {
        quantity: DataTypes.FLOAT,
        price: DataTypes.FLOAT
    },{
        classMethods: {
            associate : function(models){
                Charge_line.belongsTo(models.Charge)
                Charge_line.belongsTo(models.Product)
            }
        }
    });

    return Charge_line;
}

