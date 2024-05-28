const Sequelize = require("sequelize");
const connection = require("../../db/connection");
const Category = require("../../categories/model/Category");

const Article = connection.define("article", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

// 1- 1
Article.belongsTo(Category);
//1 - n
Category.hasMany(Article);

Article.sync({ force: false });
module.exports = Article;
