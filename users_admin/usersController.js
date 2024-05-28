const expres = require("express");
const router = expres.Router();
const model_Users = require("../users_admin/model/Users");
const model_Categories = require("../categories/model/Category");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middleware/adminAuth");

router.get("/admin/users", adminAuth, (req, res) => {
  model_Users.findAll().then((e) => {
    res.render("admin/users/index", { users: e });
  });
});

router.get("/admin/users/new", adminAuth, (req, res) => {
  model_Categories.findAll().then((e) => {
    res.render("admin/users/new", { category: e });
  });
});

router.get("/admin/users/login", (req, res) => {
  model_Categories.findAll().then((e) => {
    res.render("admin/users/login", { category: e, user:req.session.user });
  });
});

router.get("/admin/users/logout",(req, res)=>{
  req.session.user = undefined;
  res.redirect("/")
})

router.post("/authenticate", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email != "" && email != null && email != undefined) {
    if (password != "" && password != null && password != undefined) {
      model_Users.findOne({ where: { email: email } }).then((user) => {
        if (user) {
          const passValidation = bcrypt.compareSync(password, user.password);
          if (passValidation) {
            req.session.user = {
              id: user.id,
              email: user.email,
            };
            res.redirect("/")
          } else {
            res.redirect("admin/users/login");
          }
        } else {
          res.redirect("admin/users/login");
        }
      });
    }
  }
});

router.post("/admin/users/create", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email != "" && email != null && email != undefined) {
    if (password != "" && password != null && password != undefined) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      model_Users.findOne({ where: { email: email } }).then((e) => {
        if (e) {
          res.redirect("/admin/users/new");
        } else {
          model_Users
            .create({
              email: email,
              password: hash,
            })
            .then(() => {
              res.redirect("/admin/users");
            });
        }
      });
    } else {
      res.redirect("/admin/users/new");
    }
  } else {
    res.redirect("/admin/users/new");
  }
});

module.exports = router;
