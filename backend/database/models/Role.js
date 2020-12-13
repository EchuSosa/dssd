'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
   
    static associate(models) {
      
    }
  };
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Role'
  });
  return Role;
};