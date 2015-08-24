/**
 * Created by monty on 14/05/15.
 */
module.exports = function (sequelize, DataTypes){
    var Category = sequelize.define('Category', {
        name: DataTypes.STRING(25),
        def: DataTypes.STRING(250)
    },{
        classMethods : {
            associate : function(models){
                Category.hasMany(models.Product)
                Category.belongsTo(models.Business)
            }
        }

    });
    return Category;
};