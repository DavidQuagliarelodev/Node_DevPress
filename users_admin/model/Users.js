const Sequelize = require("sequelize");
const connection = require("../../db/connection");

const Users = connection.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Users.sync({ force: false });
module.exports = Users;
