const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const { success, error } = require("consola");
const { connect } = require("mongoose");
/*=======================bring app constants===============================================*/
const { DB, PORT } = require("./Config");
/*=================================initialize express app ======================================*/
const app = express();
/* ===============================middlewares starts here ======================================= */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());

require("./Middlewares/passport")(passport);

/*--------------------------------routes middlewares starts here-----------------------------*/
app.use("/api/users", require("./Routes/users"));
/*--------------------------------routes middlewares ends here-----------------------------*/
/* ===============================middlewares ends here ======================================= */
let startApp = async () => {
  try {
    await connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: true,
    });
    success({
      message: `successfully Database connected ${DB}`,
      badge: true,
    });
    //listen port
    app.listen(PORT, (err) => {
      if (err) {
        error({ message: err, badge: true });
      }
      success({ message: `Server is running on ${PORT}`, badge: true });
    });
  } catch (err) {
    error({ message: `unable to connect database ${DB}`, badge: true });
  }
};
startApp();
