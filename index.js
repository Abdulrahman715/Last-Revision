require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const cors = require("cors");

const mongoose = require('mongoose');

const httpStatusCode = require('./utils/httpStatusCode');

const path = require('path');

const url = process.env.MONGO_URL ;
  
mongoose.connect(url).then(() => {
    console.log('mongoDB server started');
})

const app = express();

app.use('uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());

app.use(bodyParser.json());

const coursesRouter = require('./Router/courses.router');
const usersRouter = require("./Router/users.router");


app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

app.all('*', (req, res, next) => {
    res.status(400).json({
        status: httpStatusCode.ERROR,
        message: "URL Error",
        data: null,
        code: 400,
    });
});

app.use((error, req, res, next) => {
    res
      .status(error.statusCode || 500)
      .json({
            status: error.statusText || httpStatusCode.ERROR,
            message: error.message,
            code: error.statusCode || 500,
            data: null
      });
})

app.listen(3000, () => {
    console.log('listening on port 3000');
});