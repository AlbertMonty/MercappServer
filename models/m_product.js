/**
 * Created by monty on 14/05/15.
 */
module.exports = function (sequelize, DataTypes){
    var Product = sequelize.define('Product',{
        name : DataTypes.STRING(25),
        units : DataTypes.STRING(15),
        unit_price : DataTypes.FLOAT,
        seasonal : DataTypes.BOOLEAN,
        description : DataTypes.STRING(250)
    },{
        classMethods : {
            associate: function (models) {
                Product.belongsTo(models.Category)
            }
        }
    });

    return Product;
};