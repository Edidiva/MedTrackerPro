
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const LOCAL_DB_CONN = process.env.LOCAL_DB
const ENV = {
  mailPassword: process.env.MAIL_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  port:process.env.PORT,
  mongoUrl: process.env.NODE_ENV === "development" ? LOCAL_DB_CONN : process.env.MONGODB,
  clientUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://pillpal.com",
};

module.exports = ENV;
