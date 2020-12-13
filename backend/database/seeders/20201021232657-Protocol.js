'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Protocol',
    [
      {
        id:1,
        user_id:1,
        name: "protocolo a",
        order: 1,    
        isLocal: 0,
        createdAt:new Date(),
        updatedAt:new Date(),
        project_id:2,
      },
      {
        id:2,
        user_id:2,
        name: "protocolo b",
        order: 1,    
        isLocal: 1,
        createdAt:new Date(),
        updatedAt:new Date(),
        project_id:1,
      },      {
        id:3,
        user_id:2,
        name: "protocolo c",
        order:2,    
        isLocal: 0,
        createdAt:new Date(),
        updatedAt:new Date(),
        project_id:2,
      },      {
        id:4,
        user_id:1,
        name: "protocolo d",
        order: 3,    
        isLocal: 1,
        createdAt:new Date(),
        updatedAt:new Date(),
        project_id:1,
      },      {
        id:5,
        user_id:1,
        name: "protocolo f",
        order: 2,    
        isLocal: 0,
        createdAt:new Date(),
        updatedAt:new Date(),
        project_id:1
      },      {
        id:6,
        user_id:1,
        name: "protocolo g",
        order: 3,    
        isLocal: 1,
        startDate:new Date(),
        endDate: new Date(),
        createdAt:new Date(),
        updatedAt:new Date(),
        project_id:1,
        score:1.25
      },
      
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Protocol', null, {}),
};
