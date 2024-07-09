const express = require('express');// dependencies necessary to recieve and send http requests
const router = express.Router();
const axios = require('axios');
const client = require('../elasticsearch/client');
require('log-timestamp'); // timestamps for messages displayed in the terminal console.log()

const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`;// data of earthquakes from the past 30 days API

// defining what the server should do once an http request to is recieved to the earthquakes end point
router.get('/earthquakes', async function (req, res) { // routes for /earthquakes
    console.log('Loading Application...'); // prints message once the server recieves http request
    res.json('Running Application...'); // displays message on user screen

    // retrieve data from the usgs api, create an object for each earthquake, send the object to elasticsearch pipeline for transformation, ingest into index
    indexData = async () => {
        try {
            console.log('Retrieving data from the USGS API'); // when function is called displayed in terminal
            // get request to the usgs api
            const EARTHQUAKES = await axios.get(`${URL}`, {
                headers: {
                    'Content-Type': ['application/json', 'charset=utf-8'],
                },
            });

            console.log('Data retrieved!');

            results = EARTHQUAKES.data.features; // var results is equal to the retrieved data from the API from the features array

            console.log('Indexing data...');

            results.map( // for each earthquake object in the array a json object is created
                async (results) => (
                    (earthquakeObject = {
                        place: results.properties.place,
                        time: results.properties.time,
                        tz: results.properties.tz,
                        url: results.properties.url,
                        detail: results.properties.detail,
                        felt: results.properties.felt,
                        cdi: results.properties.cdi,
                        alert: results.properties.alert,
                        status: results.properties.status,
                        tsunami: results.properties.tsunami,
                        sig: results.properties.sig,
                        net: results.properties.net,
                        code: results.properties.code,
                        sources: results.properties.sources,
                        nst: results.properties.nst,
                        dmin: results.properties.dmin,
                        rms: results.properties.rms,
                        mag: results.properties.mag,
                        magType: results.properties.magType,
                        type: results.properties.type,
                        longitude: results.geometry.coordinates[0],
                        latitude: results.geometry.coordinates[1],
                        depth: results.geometry.coordinates[2],
                    }),
                    await client.index({ // method to index transformed data
                        index: 'earthquakes', // location for indexed data to be placed
                        id: results.id, // assign id idential to object from api
                        body: earthquakeObject, // reps one earthquake
                        pipeline: 'earthquake_data_pipeline', // send retrieved data to pipeline
                    })
                )
            );

            if (EARTHQUAKES.data.length) {  // if data still left continue to call function
                indexData();
            } else { // all data indexed
                console.log('Data has been indexed successfully!');
            }
        } catch (err) { // error that occured during indexing
            console.log(err);
        }

        console.log('Preparing for the next round of indexing...');
    };
    indexData();
});

module.exports = router; // expose the router via node.js module exports
