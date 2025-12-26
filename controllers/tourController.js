const fs = require('fs');
const path = require('path');
const Tour = require(path.join(__dirname, '../models/tourModel.js'));

const gettopcheap = (req, res, next) => {
  req.query = {
    ...req.query,
    sort: 'price',
    limit: '5',
  };

  next();
};
const getalltours = async (req, res) => {
  try {
    const queryparams = req.query;
    console.log(queryparams);
    const obj = Object.assign({}, queryparams);
    const excludeFields = ['limit', 'page', 'sort', 'fields'];
    excludeFields.forEach((ele) => delete obj[ele]);
    let query = Tour.find(obj);

    if (queryparams.sort) {
      const sortBy = queryparams.sort.split(',').join(' ');
      query.sort(sortBy);
    }

    if (queryparams.fields) {
      const fields = queryparams.fields.split(',').join(' ');
      query.select(fields);
    } else {
      query.select('-__v');
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const total = await Tour.countDocuments();
      if (skip >= total) {
        return res.status(404).json({
          status: 'failure',
          message: 'This page does not exist',
        });
      }
    }

    const tours = await query;

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      error: err,
    });
  }
};

const posttour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      error: err,
    });
  }
};

const gettourbyid = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: 'failure',
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      status: 'Success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err.message,
    });
  }
};

const patchtour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return res.status(404).json({
        status: 'failure',
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      status: 'Success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err.message,
    });
  }
};

const deletetour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: 'failure',
        message: 'Tour not found',
      });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err.message,
    });
  }
};

const puttour = async (req, res) => {
  try {
    const tour = await Tour.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tour) {
      return res.status(404).json({
        status: 'failure',
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      status: 'Success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err.message,
    });
  }
};

module.exports = {
  getalltours,
  posttour,
  gettourbyid,
  patchtour,
  deletetour,
  puttour,
  gettopcheap,
};
