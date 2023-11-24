const express = require("express");
const UserController = require("../controller/user");
const useCatchErrors = require("../error/catchErrors");
const isAuthenticated = require("../middlewares/auth");

class UserRoute {
  router = express.Router();
  userController = new UserController();
  path = "/user";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}/data`,
      useCatchErrors(this.userController.getUser.bind(this.userController))
    );
    this.router.put(
      `${this.path}/updateProfile`, isAuthenticated,
      useCatchErrors(this.userController.updateUser.bind(this.userController))
    );
    this.router.put(
      `${this.path}/reset-password`, isAuthenticated,
      useCatchErrors(this.userController.resetPassword.bind(this.userController))
    );
  }
}

module.exports = UserRoute;
