require('dotenv').config()

module.exports = {
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres', 
    dialectOptions: {  
    },
  },
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {      
    },
  }
}

