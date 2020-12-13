'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Project',
    [
      {
        id:1,
        user_id:1,
        name: "project 1",
        createdAt:new Date(),
        updatedAt:new Date(),

      },
      {
        id:2,
        user_id:2,
        name: "project 2",
        createdAt:new Date(),
        updatedAt:new Date(),

      },
      {
        id:3,
        user_id:3,
        name: "project 3",
        createdAt:new Date(),
        updatedAt:new Date(),

      },
      
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Project', null, {}),
};

