const express = require("express");
const AuthController = require("../controller/auth");
const useCatchErrors = require("../error/catchErrors");
const isAuthenticated = require("../middlewares/auth");
class AuthRoute {
  router = express.Router();
  authController = new AuthController();

  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    
    this.router.post(
      `${this.path}/user/signup`,
      useCatchErrors(this.authController.Signup.bind(this.authController))
    );
    this.router.post(
      `${this.path}/login`,
      useCatchErrors(this.authController.login.bind(this.authController))
    );
  }
}

module.exports = AuthRoute;