const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const { db, logsList, logsInsert, logsDelete } = require("./modules/db.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;


app.listen(PORT, (req, res) => {
  console.log(`server run on port ${PORT}`);
});


/**
 * Route to get list of logs
 */
app.get("/api/v1/logs", (req, res) => {
  logsList((err, rows) => {
    res.json({
      logs: rows,
    });
  });
});


/**
 * Route to insert log to db
 */
app.post("/api/v1/logs", (req, res, next) => {
  var errors = [];

  if (!req.body.description) {
    errors.push("description not provided");
  }
  if (!req.body.start) {
    errors.push("Start time not privided");
  }
  if (!req.body.end) {
    errors.push("End time not provided");
  }

  if (req.body.description.length < 5) {
    errors.push("Description minimum length is 6 character");
  }

  if (errors.length) {
    res.status(200).json({ success: false, message: errors.toString() });
    return;
  }

  let desc = req.body.description;
  let start = req.body.start;
  let end = req.body.end;

  logsInsert(desc, start, end, (err, id) => {
    if (err) {
      res.status(200).json({ success: false, message: err });
    } else {
      res.status(200).json({ success: true, message: id });
    }
  });
});

/**
 * Route to remove a log from db
 */
app.post("/api/v1/logs/remove", (req, res, next) => {
  var error = [];
  if (!req.body.id) {
    error.push("id not defined");
  }

  if (error.length) {
    res.status(200).json({ success: false, message: error });
    return;
  }
  let id = req.body.id;
  logsDelete(id, (err, id) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      res.json({ success: true, message: id });
    }
  });
});
