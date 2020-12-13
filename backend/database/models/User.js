'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model) {
      
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_login: DataTypes.DATE
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'User'
 
  });
  return User;
};