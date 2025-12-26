const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../config.env') });

const Tour = require('../models/tourModel');

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

// 2️⃣ Read JSON file
const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

// 3️⃣ Import data
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// 4️⃣ Delete all data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// 5️⃣ CLI command handling
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
