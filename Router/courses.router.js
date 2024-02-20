const express = require('express');

const router = express.Router();

const controllerCourses = require("../controller/courses.controller");
const { validationSchema } = require('../Middleware/courses.validation');
const verifyToken = require('../Middleware/verifyToken');


const allowedTo = require('../Middleware/allowedTo');
const userRoles = require('../utils/user.roles');



router.route('/')
    .get(controllerCourses.getAllCourses)
    .post(validationSchema(),verifyToken,controllerCourses.addCourse); // validation schema is a function

router
  .route("/:courseId")
  .get(controllerCourses.getSingleCourse)
  .patch(controllerCourses.updatePatchCourse)
  .put(controllerCourses.updatePutCourse)
  .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), controllerCourses.deletedCourse);

module.exports = router;