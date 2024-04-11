const { v4: uuidv4 } = require('uuid');
const HttpError = require('./../models/http-error');
const { validationResult } = require('express-validator');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Atul Bansal',
        email: 'abc@gmail.com',
        password: 'testpassword'
    }
]

const getAllUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
    const { name, email, password } = req.body;

    const validatedResult = validationResult(req);
    if (!validatedResult.isEmpty()) {
        console.log(validatedResult);
        let errorInParams = validatedResult.errors.map(val => {
            return `${val.path} ${val.msg}`
        }).join(', ');

        return next(
            new HttpError(
                `Invalid paramenters passed, please check param - ${errorInParams}`,
                422));
    }

    const hasUser = DUMMY_USERS.find(user => user.email === email);

    if (hasUser) {
        return next(
            new HttpError(
                'Could not create user, email already exists',
                422
            )
        );
    }

    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(user => user.email === email);

    if (!identifiedUser) {
        return next(
            new HttpError(
                'Could not identify user, credentails seems to be wrong',
                401
            ));
    }

    if (identifiedUser.password !== password) {
        return next(new HttpError('Incorrect password', 401));
    }

    res.json({ msg: 'login successful' });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
