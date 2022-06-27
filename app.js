require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// Security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// Connect DB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/auth");
const destinationRouter = require("./routes/destination");

// Middleware
const authenticateUser = require("./middleware/authentication");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1); // setup for heroku
app.use(express.json());
// extra packages
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/destination", authenticateUser, destinationRouter); // Authenticate all routes for jobs

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
