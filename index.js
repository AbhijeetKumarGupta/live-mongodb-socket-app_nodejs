const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
var bodyParser = require("body-parser");
const socketIO = require("socket.io");
const http = require("http");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

let port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIO(server);

const dbURI = process.env.CONNECTION_STRING;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(dbURI, options)
  .then(() => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

var randomDataSchema = new mongoose.Schema({}, { strict: false });
var RandomData = mongoose.model("randomdatas", randomDataSchema);

// CORS ERROR RESOLUTION //
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Accept");
  next();
});
// CORS ERROR RESOLUTION //

io.on("connection", (socket) => {
  io.emit("startLiveData", "Starting live data updation!");
  socket.on("newAdded", (addEventName) => {
    io.emit(addEventName, "New Entry Added! Updating List");
  });
});

app.get("/getData", async (req, res) => {
  var data = await RandomData.find();
  res.send(data);
});

app.get("/getDataInRange", async (req, res) => {
  var data = await RandomData.find({
    timeStamp: {
      $lte: req.query.dateEnd,
      $gte: req.query.dateStart,
    },
  });
  res.send(data);
});

app.post("/insertData", async (req, res) => {
  var document = JSON.parse(JSON.stringify(req.body));
  var data = await RandomData.insertMany([document]);
  res.send(JSON.parse(JSON.stringify(req.body)));
});

server.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
