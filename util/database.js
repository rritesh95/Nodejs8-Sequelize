const { Sequelize } = require('sequelize'); // need to use { Sequelize } for intellisense
//to work instead of Sequelize

const sequelize = new Sequelize('node-complete','root','Sql@210791',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Sql@210791'
// });

// module.exports = pool.promise();
// //promise() will allow us to work with promise when connecting to database

