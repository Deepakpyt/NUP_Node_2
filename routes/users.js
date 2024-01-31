var express = require("express");
var router = express.Router();
var fs = require("fs");
const filePath = "./public/user.json";
const userList = require("../public/user.json");

/* GET users listing. */
router.get("/", function (req, res, next) {
  fs.readFile(filePath, (err, data) => {
    if (!err) {
      let userList = JSON.parse(data);
      console.log("User List : ", userList);
      res.status(200).json({ message: "success", content: userList });
    } else {
      console.error(err);
      res.status(500).json({ message: "failure", content: null, error: err });
    }
  });
});

// GET single user by id
router.get("/:id", function (req, res) {
  let userId = req.params.id;
  console.log(`Getting User with ID ${userId}`);
  // find the user in the array of users and return it or send an error message;
  let user = userList.filter((data) => data.id === parseInt(userId));

  if (!user[0]) {
    res.status(404).json({ Message: "No User Found With Given Id" }).end();
  } else {
    res.status(200).json(user[0]).end();
  }
});

// POST a new user to JSON file
router.post("/add", function (req, res) {
  const { id, name, email } = req.body;

  const alreadyExisting = userList.filter((user) => user.id === id);
  if (alreadyExisting.length > 0) {
    res.status(409).json({ Message: "User Id Already Exists!" }).end();
  } else {
    if (
      id !== null &&
      id !== undefined &&
      name !== null &&
      name !== undefined &&
      email !== null &&
      email !== undefined
    ) {
      const newUser = { id, name, email };
      userList.push(newUser);
      fs.writeFileSync(filePath, JSON.stringify(userList), "utf8");
      res.status(201).json(newUser).end();
    } else {
      res
        .status(400)
        .json({ Status: "Bad Request", Message: "Please provide all fields." })
        .end();
    }
  }
});

// Update an existing user information
router.put("/:id/update", function (req, res) {
  const userId = req.params.id;
  const { name, email } = req.body;
  if (name !== undefined || email !== undefined) {
    // check if the user exists in the list
    let foundUser = userList.filter((user) => user.id === parseInt(userId));
    if (!foundUser[0]) {
      return res.status(404).json("The user with given ID does not exist");
    } else {
      const userListAfterUpdate = userList.map((user) => {
        if (user.id === parseInt(userId)) {
          return {
            ...user,
            name: name ? name : user.name,
            email: email ? email : user.email,
          };
        } else {
          return user;
        }
      });
      fs.writeFileSync(filePath, JSON.stringify(userListAfterUpdate));
      res
        .status(200)
        .json({ message: "Updated", content: userListAfterUpdate });
    }
  } else {
    return res
      .status(400)
      .json({ Message: "Please provide at least one field to update" });
  }
});

// Delete a user from the JSON file
router.delete("/:id/delete", function (req, res) {
  let userId = req.params.id;
  // check if the user exists in the list
  let foundUser = userList.filter((user) => user.id === parseInt(userId));
  if (!foundUser[0]) {
    return res.status(404).json("The user with given ID does not exist");
  } else {
    const userListAfterDelete = userList
      .map((user) => {
        if (user.id !== parseInt(userId)) return user;
      })
      .filter((user) => user != null);
    fs.writeFileSync(filePath, JSON.stringify(userListAfterDelete));
    res.json(foundUser[0]);
  }
});

module.exports = router;
