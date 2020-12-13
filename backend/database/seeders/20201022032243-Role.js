'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Role',
    [
      {
        id:1,
        name: "admin",
        updatedAt:new Date(),
        createdAt:new Date(),
      
      },
      {
        id:2,
        name: "user",
        updatedAt:new Date(),
        createdAt:new Date(),
      },
      {
        id:3,
        name: "moderator",
        updatedAt:new Date(),
        createdAt:new Date(),
      },
      
    ], 
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Role', null, {}),
};
