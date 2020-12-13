"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Protocol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Protocol.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
      },
      username: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isLocal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
      project_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: DataTypes.INTEGER,
      started: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      executed:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "Protocol",
    }
  );
  return Protocol;
};
