const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const autenticador = require("./db/authenticator");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users_admin/usersController");
const model_Article = require("./articles/model/Article");
const model_Categories = require("./categories/model/Category");
const session = require("express-session");
const port = 8080;

autenticador();
app.use(
  session({
    secret: "123456",
    cookie: { maxAge: 3600000 },
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  model_Article
    .findAll({ raw: true, order: [["id", "DESC"]], limit: 4 })
    .then((article) => {
      model_Categories
        .findAll({ raw: true, order: [["id", "DESC"]] })
        .then((categories) => {
          res.render("index", {
            articles: article,
            category: categories,
            user: req.session.user,
          });
        });
    });
});

app.get("/:slug/", (req, res) => {
  const slug = req.params.slug;
  if (slug != undefined && slug != null && slug != "") {
    model_Article.findOne({ where: { slug: slug } }).then((article) => {
      model_Categories
        .findAll({ raw: true, order: [["id", "DESC"]] })
        .then((categories) => {
          res.render("articles", {
            articles: article,
            category: categories,
            user: req.session.user,
          });
        });
    });
  }
});

app.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  if (slug != undefined && slug != null && slug != "") {
    model_Categories
      .findOne({ where: { slug: slug }, include: { model: model_Article } })
      .then((categories) => {
        model_Categories.findAll().then((e) => {
          res.render("categories", {
            category: e,
            categoryArticles: categories,
            user: req.session.user,
          });
        });
      });
  }
});

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.listen(port, (e) => {
  if (e) {
    console.log(e);
  } else {
    console.log("Open Servidor");
  }
});
