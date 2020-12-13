'use strict';
var bcrypt = require("bcryptjs");

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'User',
    [
      {
        id:1,  
        username: 'fran221223212',
	      password:bcrypt.hashSync('1234563',8),
        name:  'Franco',
        email: 'franco@example.com',
        createdAt: new Date(),
        updatedAt:new Date(),
        last_login:new Date() 
      },
      {
        id:2,  
        username: 'juan',
	      password:bcrypt.hashSync('1234563',8),
        name:  'Jane Doe',
        email: 'janedoe2@example.com',
        createdAt: new Date(),
        last_login:new Date(),
        updatedAt:new Date(),
      },
      {
        id:3,  
        username: 'pedro',
	      password:bcrypt.hashSync('1234563',8),
        name:  'Jane Doe',
        email: 'janedoe3@example.com',
        createdAt: new Date(),
        last_login:new Date(),
        updatedAt:new Date(),
      },
      
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('User', null, {}),
};
