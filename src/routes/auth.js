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
      useCatchErrors(this.authController.SignUp.bind(this.authController))
    );
    this.router.post(
      `${this.path}/user/login`,
      useCatchErrors(this.authController.Login.bind(this.authController))
    );
    this.router.post(
      `${this.path}/user/verifyOtp`,
      useCatchErrors(this.authController.verifyOTP.bind(this.authController))
    );
    this.router.post(
      `${this.path}/user/forgetPassword`,
      useCatchErrors(this.authController.forgetPassword.bind(this.authController))
    );
    this.router.post(
      `${this.path}/user/verifyResetOtp`,
      useCatchErrors(this.authController.verifyResetOTP.bind(this.authController))
    );


  }
}

module.exports = AuthRoute;