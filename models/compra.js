'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Compra.belongsToMany(models.Produto, {
        foreignKey: 'ProdutoId',
        through: 'ItemCompra', as: 'produto_compra'
    });
      Compra.belongsTo(models.Cliente, {foreignKey: 'ClienteId', as: 'clientes'});
      Compra.hasMany(models.ItemCompra, {foreignKey: 'CompraId', as: 'item_compra'});
    }
  };
  Compra.init({
    data: DataTypes.DATEONLY,
    ClienteId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Compra',
  });
  return Compra;
};