const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require(`${__dirname}/app.js`);
const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then((con) => console.log('connection successful'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at port ${port}`));
