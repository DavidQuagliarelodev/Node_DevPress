const Sequelize = require('sequelize')
const connection = new Sequelize('devpress', 'root', 'Gisele12@', {
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00"
})

module.exports = connection;