'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Protocol', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },      
      user_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      isLocal: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      score: {
        type: Sequelize.INTEGER
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Protocol');
  }
};