const express = require('express');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const cors = require('cors');
const AppError = require('./utils/appError');

const calculateRoute = require('./routes/calculateRoute');

const app = express();

//enable our app to trust proxies
app.enable('trust proxy');

//GLOBAL MIDDLEWARES

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8000'],
  })
);

app.options(
  '*',
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8000'],
  })
);

app.use(helmet());

app.use(express.json({ limit: '10kb' }));

app.use(xss());

app.use((req, res, next) => {
  //lets add a request time to every request we recieve
  req.requestTime = new Date().toISOString();

  next();
});

//ROUTING
app.use('/api', calculateRoute);

//lets handle all unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
