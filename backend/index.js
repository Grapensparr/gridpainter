const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
app.use(cors());
const indexRouter = require('./routes/index');
const referenceImageRouter = require('./routes/referenceImage');
const usersRouter = require('./routes/users');
const saveLoadRouter = require('./routes/saveLoadImage');
const chatHandler = require('./chat');
const gameHandler = require('./game');
const bodyParser = require('body-parser');

async function init() {
  try {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(process.env.MONGODB_URI_CLOUD, options);
    console.log('Mongoose connected successful!');
  } catch (error) {
    console.error(error);
  }
}
init();

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

chatHandler(io);
gameHandler(io);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/referenceImage', referenceImageRouter);
app.use('/users', usersRouter);
app.use('/images', saveLoadRouter);
server.listen(8080);
module.exports = { app: app, server: server };