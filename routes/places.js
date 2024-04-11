const express = require('express');
const placesController = require('./../controllers/places');
const { check } = require('express-validator');

const router = express.Router();

router.get('/:pid', placesController.getPlaceById);

router.get('/user/:uid', placesController.getPlacesByUserId);

router.post(
    '/',
    [
        check('title').not().isEmpty().withMessage('should not be empty'),
        check('description')
            .isLength({ min: 5, max: 60 })
            .withMessage('should have length more than 5 and less than 60'),
        check('address').not().isEmpty().withMessage('should not be empty')
    ],
    placesController.createPlace
);

router.patch(
    '/:pid',
    [
        check('title').not().isEmpty().withMessage('should not be empty'),
        check('description')
            .isLength({ min: 5, max: 60 })
            .withMessage('should have length more than 5 and less than 60')
    ],
    placesController.updatePlace);

router.delete('/:pid', placesController.deletePlace);

module.exports = router;