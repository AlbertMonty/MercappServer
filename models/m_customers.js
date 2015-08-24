/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {

    var Customer = sequelize.define('Customer', {
        name: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING(255),
            unique:true,
            allowNull:false
        },
        password: DataTypes.STRING(100),
        phone_number: DataTypes.STRING(9)
    }, {
        classMethods: {
            associate: function (models) {
                Customer.belongsToMany(models.Business,{through : 'CustomerBusiness'})
                Customer.hasMany(models.Charge)
                Customer.hasMany(models.Address)
            }
        }
    });

    return Customer;
};