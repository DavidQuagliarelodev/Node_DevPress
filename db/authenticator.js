const Sequelize = require('sequelize')
const connection = require('./connection')

async function autenticador(){
    try {
        await connection.authenticate()
        console.log("connection sucess")
    } catch(e){
        console.log(e)
    }
}

module.exports = autenticador