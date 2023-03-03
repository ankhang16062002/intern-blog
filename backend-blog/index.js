const app = require("./app"); //add change
const connectDatabase = require("./config/connectDatabase");
const process = require("process");

//write after config env to use variable
const passportSetup = require("./utils/passport-setup"); // require to initial passport setup

//catch error exception internal like: run function not declear, error internal
process.on("uncaughtException", (error) => {
  console.log(`catch error exception: ${error.message}`);
  process.exit(1);
});

//emitted when promise rejection is not handle
process.on("unhandledRejection", (error) => {
  console.log(`shutting down server to slove rejection promise: ${error}`);
  process.exit(1);
});

// connect to database
connectDatabase();

app.listen(process.env.PORT || 8800, () => {
  //add change
  console.log(`backend is running port ${process.env.PORT}`);
});
