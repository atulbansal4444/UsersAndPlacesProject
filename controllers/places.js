const { v4: uuidv4 } = require('uuid');
const HttpError = require('./../models/http-error');
const { validationResult } = require('express-validator');
const locationUtils = require('./../utils/location');

let DUMMY_PLACES = [
    {
        id: 'p1',
        address: 'asdasda',
        creator: 'u1',
        title: 'hell',
        location: {
            lat: 37.2132,
            lng: -122.23123
        }
    },
    {
        id: 'p2',
        address: 'hvjhv',
        creator: 'u2',
        title: 'hell'
    }
];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        return next(new HttpError('Could not find the place for provided Id.', 404));
    }

    res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(user => user.creator === userId);

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find the places for provided user id.', 404));
    }

    res.json({ places });
};

const createPlace = async (req, res, next) => {
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

    const { title, description, address, creator } = req.body;

    //TODO: add validation of id on setting up db to prevernt override of the created place

    let coordinates;
    try {
        coordinates = await locationUtils.getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;

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

    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(place => place.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId);

    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(201).json({ place: updatedPlace });
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;

    if (!DUMMY_PLACES.find(place => place.id === placeId)) {
        return next(new HttpError('Could not find a place with the id', 404));
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId);

    res.status(201).json({ msg: 'Successfully deleted' });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
