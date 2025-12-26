const express = require('express');
const tourRouter = require(`${__dirname}/routes/tourRoutes.js`);
const userRouter = require(`${__dirname}/routes/UserRoutes.js`);
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

const app = express();

app.use(limiter); //rate limting
app.use(helmet()); // http only headers
app.use(xss()); // Prevents xss attacks
app.use(mongoSanitize()); // Nosql injection
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5000', // frontend URL
    credentials: true, // allow cookies
  })
);

app.use(express.static(`${__dirname}/public`));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
  res.status(200).send('Hello from the server');
});

module.exports = app;
