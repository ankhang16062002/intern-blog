const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session); //import to add, remove session when session exprise in mongoDB
const passport = require("passport");
const errorMiddleware = require("./middleware/ErrorMiddleware");
const resetCookieExprise = require("./middleware/CookieMiddleware");
const authRoute = require("./routes/AuthRoute");
const topicRoute = require("./routes/TopicRoute");
const categoryRoute = require("./routes/CategoryRoute");
const userRoute = require("./routes/UserRoute");
const cloudinary = require("cloudinary");
const commentRoute = require("./routes/CommentRoute");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const postRoute = require("./routes/PostRoute");
const notifycationRoute = require("./routes/NotifycationRoute");

const {
  addUser,
  removeUser,
  findUserOnline,
} = require("./utils/supportSocket-io");

const app = express();

//import socket
const { createServer } = require("http");
const { Server } = require("socket.io");

//config env
dotenv.config({ path: "./config/variable.env" });

//config cloudnary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//use body json request
app.use(express.json({ limit: "10MB" }));
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: "10mb",
    extended: true,
  })
);
app.use(fileUpload());

app.set("trust proxy", 1);

// establish session
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      // sameSite: "none",
      // secure: true,
    },
    resave: false,
    store: new MongoStore({
      url: process.env.MONGODB_URL,
    }),
  })
);

app.use(passport.authenticate("session"));

// use this middleware to reset cookie expiration time
// when user hit page every time
app.use(resetCookieExprise);

// cors
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//config route for app
app.use("/auth", authRoute);
app.use("/topic", topicRoute);
app.use("/category", categoryRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/notifycation", notifycationRoute);

//error middleware
app.use(errorMiddleware);

// create httpServer for socket
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8000",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("someone has connected");

  socket.on("newUser", (user) => {
    addUser(user, socket.id, onlineUsers);
  });

  socket.on(
    "sendNotifycation",
    ({
      userSender,
      userRecevied,
      type,
      postSlug,
      commentId,
      replyId,
      notifycationId,
    }) => {
      const user = findUserOnline(userRecevied, onlineUsers);

      if (user) {
        io.to(user.socketId).emit("getNotifycation", {
          userSender,
          userRecevied,
          type,
          postSlug,
          commentId,
          replyId,
          notifycationId,
          createdAt: Date.now(),
        });
      }
    }
  );

  socket.on("disconnect", () => {
    removeUser(socket.id, onlineUsers);
  });
});

module.exports = httpServer;
