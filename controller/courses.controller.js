
const { validationResult } = require("express-validator");

const Course = require('../models/courses.model');

const httpStatusCode = require('../utils/httpStatusCode');
const asyncWrapper = require("../Middleware/asyncWrapper");
const appError = require('../utils/appError');

const getAllCourses = asyncWrapper(
  async (req, res) => {

    const query = req.query;

    const limit = query.limit || 4;
    const page = query.page || 1;

    const skip = (page - 1) * limit;

    const courses = await Course.find({ price: { $gte: 2000 } }, { "__v": false }).limit(limit).skip(skip);

    res.status(200).json({
      status: httpStatusCode.SUCCESS, data: {
        allCourses: courses
      }
    });
  });

const getSingleCourse = asyncWrapper(async (req, res,next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {

    const error = appError.create("course not found", 404, httpStatusCode.FAIL);
    return next(error);

  }

  res.status(200).json({
    status: httpStatusCode.SUCCESS,
    data: {
      singleCourse: course,
    },
  });
});

const addCourse = asyncWrapper(async (req, res,next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {

    const error = appError.create(errors.array(), 400, httpStatusCode.FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);
  await newCourse.save();

  res.status(201).json({
    status: httpStatusCode.SUCCESS,
    data: {
      newCourse: newCourse,
    },
  });
});

const updatePatchCourse = asyncWrapper(async (req, res) => {
      const courseId = req.params.courseId;

      const updatedCourse = await Course.findByIdAndUpdate(courseId, {
        $set: { ...req.body },
      });

    res.status(200).json({
      status: httpStatusCode.SUCCESS,
      data: {
        oldCourse: updatedCourse,
      },
    });
});

const updatePutCourse = asyncWrapper(async (req, res) => {
      const courseId = req.params.courseId;

      const updatedCourse = await Course.findByIdAndReplace(
        courseId,
        {
          $set: { ...req.body },
        },
        { new: true }
      );

      res.status(200).json({
        status: httpStatusCode.SUCCESS,
        data: {
          updatedCourse,
        },
      });
});

const deletedCourse = asyncWrapper(async (req, res) => {
  await Course.deleteOne({ _id: req.params.courseId });
  res.status(200).json({
    status: httpStatusCode.SUCCESS,
    data: null,
  });
});

module.exports = {
    getAllCourses,
    getSingleCourse,
    addCourse,
    updatePatchCourse,
    updatePutCourse,
    deletedCourse
}