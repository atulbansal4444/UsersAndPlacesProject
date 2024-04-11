const axios = require('axios');
const HttpError = require('../models/http-error');
const getCoordsForAddress = async (address) => {
    const API_KEY = 'Add_your_key';
    const url = `
        https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${API_KEY}`;
    
    const response = await axios.get(url);

    const data = response.data;
    console.log(data);

    // I dont have api key that's why sending dummy value on access denied
    if (data.status === 'REQUEST_DENIED') {
        return {
            lat: 37.2132,
            lng: -122.23123
        };
    }

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError(
            'Could not find location for the specific address',
            422
        )

        throw error;
    }

    const coordinates = data.results[0].geometry.location;
    return coordinates;
};

exports.getCoordsForAddress = getCoordsForAddress;
