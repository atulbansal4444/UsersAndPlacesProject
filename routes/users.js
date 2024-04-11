const express = require('express');
const usersController = require('./../controllers/users');
const { check } = require('express-validator');

const router = express.Router();

router.get('/', usersController.getAllUsers);

router.post(
    '/signup',
    [
        check('name')
            .not()
            .isEmpty()
            .withMessage('should not be empty'),
        check('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('is not valid'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('should not be less than 8 char')
    ],
    usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;