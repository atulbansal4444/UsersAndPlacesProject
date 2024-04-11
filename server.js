const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // /api/places/*

app.use('/api/users', usersRoutes); // /api/users/*

app.use((req, res, next) => {
    const error = new HttpError('couldnt find this route', 404);
    throw error;
})

//error handler middleware
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500).json({ msg: error.message || 'Unknown Error'});
})

app.listen(5005);
