var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {

  res.render("index", {
    title: "Express",
    message: "Welcome to Express API Trial! move to '/users' for CRUD.",
    info: "Use Postman or any other REST api testing.",
    methods: {
      getAll: "/users",
      getById: "/users/:id",
      addUser: "/users/add",
      updateById: "/users/:id/update",
      deleteById: "/users/:id/delete",
    },
    data:"Hello"
  })
  
});

module.exports = router;
