const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const model_Category = require("./model/Category");
const adminAuth = require("../middleware/adminAuth");


router.get("/admin/categories/", adminAuth, (req, res) => {
  model_Category.findAll({ raw: true }).then((e) => {
    res.render("admin/categories/index", {
      category: e,
    });
  });
});

router.get("/admin/categories/new", adminAuth,(req, res) => {
  res.render("admin/categories/new");
});

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    res.redirect("/admin/categories/");
  }

  model_Category.findByPk(id).then((e) => {
    if (e != undefined && e != null && e != "") {
      if (e != isNaN) {
        res.render("admin/categories/edit", { category: e });
      } else {
        res.redirect("/admin/categories/");
      }
    } else {
      res.redirect("/admin/categories/");
    }
  });
});

router.post("/admin/categories/save", (req, res) => {
  const title = req.body.title;
  if (title != undefined && title != null && title != "") {
    model_Category
      .create({
        title: title,
        slug: slugify(title),
      })
      .then(() => res.redirect("/admin/categories"));
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.post("/admin/categories/delete", (req, res) => {
  const id_category = req.body.id_category;
  if (id_category != undefined && id_category != null && id_category != "") {
    if (id_category != isNaN) {
      model_Category
        .destroy({
          where: { id: id_category },
        })
        .then(() => {
          res.redirect("/admin/categories");
        });
    } else {
      res.redirect("/admin/categories");
    }
  } else {
    res.redirect("/admin/categories");
  }
});

router.post("/admin/categories/update", (req, res) => {
  const id = req.body.id_category;
  const title = req.body.title;
  model_Category
    .update({ title: title, slug: slugify(title) }, { where: { id: id } })
    .then(() => {
      res.redirect("/admin/categories");
    });
});


module.exports = router;
