"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
      bonitaIdProject: {
        type: DataTypes.STRING,
      },
      started: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "iniciado"
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "Project",
    }
  );
  return Project;
};
