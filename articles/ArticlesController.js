const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const model_Article = require("./model/Article");
const model_Categories = require("../categories/model/Category");
const adminAuth = require("../middleware/adminAuth");

router.get("/admin/articles/", adminAuth, (req, res) => {
  model_Article
    .findAll({ include: [{ model: model_Categories }] })
    .then((e) => {
      res.render("admin/articles/index", { articles: e });
    });
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
  model_Categories.findAll({ raw: true }).then((e) => {
    res.render("admin/articles/new", {
      categories: e,
    });
  });
});

router.get("/admin/articles/edit/:id_article",adminAuth, (req, res) => {
  const id_article = req.params.id_article;
  model_Article
    .findByPk(id_article, { include: [{ model: model_Categories }] })
    .then((e) => {
      if (e != undefined && e != null && e != "" && e != isNaN) {
        model_Categories.findAll({ raw: true }).then((category) => {
          res.render("admin/articles/edit", {
            articles: e,
            categories: category,
          });
        });
      } else {
        res.redirect("/admin/articles/");
      }
    });
});

router.get("/articles/page/:num", (req, res) => {
  const num = req.params.num;
  let list = 0;
  if (isNaN(num) || num == 0) {
    list = 0;
  } else {
    list = parseInt(num) * 4;
  }

  model_Article
    .findAndCountAll({
      limit: 4,
      offset: list,
      order: [['id', 'DESC']]
    })
    .then((pages) => {
      let next;
      if (list + 4 >= pages.count) {
        next = false;
      } else {
        next = true;
      }
      const result = {
        next: next,
        pages,
      };
      model_Categories.findAll().then((category)=>{
        res.render("admin/articles/page", {
          category: category,
          articles: result,
          numPage: parseInt(num),
          user: req.session.user
        })
      })
    });
});

router.post("/admin/articles/save", (req, res) => {
  const title = req.body.title;
  const body_article = req.body.body_article;
  const categories_select_id = req.body.categories_select;
  if (title != undefined && title != null && title != "") {
    if (
      body_article != undefined &&
      body_article != null &&
      body_article != ""
    ) {
      if (
        categories_select_id != undefined &&
        categories_select_id != null &&
        categories_select_id != ""
      ) {
        model_Article
          .create({
            title: title,
            slug: slugify(title),
            body: body_article,
            categoryId: categories_select_id,
          })
          .then(() => {
            res.redirect("/admin/articles");
          });
      }
    }
  }
});

router.post("/admin/articles/delete", (req, res) => {
  const id_article = req.body.id_article;
  if (id_article != undefined && id_article != null && id_article != "") {
    if (id_article != isNaN) {
      model_Article
        .destroy({
          where: {
            id: id_article,
          },
        })
        .then(() => {
          res.redirect("/admin/articles");
        });
    }
  }
});

router.post("/admin/articles/update", (req, res) => {
  const id_article = req.body.id_article;
  const title_article = req.body.title_article;
  const body_article = req.body.body_article;
  const id_category = req.body.id_category;
  model_Article
    .update(
      {
        title: title_article,
        slug: slugify(title_article),
        body: body_article,
        categoryId: id_category,
      },
      {
        where: {
          id: id_article,
        },
      }
    )
    .then(() => {
      res.redirect("/admin/articles");
    });
});

module.exports = router;
