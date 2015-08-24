/**
 * Created by monty on 17/04/15.
 */
module.exports = function(sequelize, DataTypes) {
    var Business = sequelize.define('Business', {
        name: {
            type: DataTypes.STRING(255),
            unique:true,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING(255),
            unique:true,
            allowNull:false
        },
        password: DataTypes.STRING(100),
        description: DataTypes.STRING(500),
        phone_number: DataTypes.STRING(9),
        facebook_link: DataTypes.STRING(50)
    },{
        classMethods : {
            associate : function(models) {
                Business.belongsToMany(models.Customer, {through : 'CustomerBusiness'})
                Business.hasMany(models.Charge)
                Business.hasOne(models.Address)
                Business.hasMany(models.Category)
            }
        }
    });

    return Business;
};
