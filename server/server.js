const { Client } = require('@elastic/elasticsearch');
// Create a server with Express (require the express library to access Express functionalities)
const express = require('express');
const client = require('./elasticsearch/client'); // access to elasticsearch client 
const cors = require('cors'); // allows server localhost3000 and client localhost3001 to exchange info without cors error
const app = express();// Create an express app
const port = 3001;
const data = require('./data_management/retrieve_and_ingest_data');
app.use('/ingest_data', data); // function retrieve_and_inge... iis ran once an http req from a url path starting with /ingest_data

app.use(cors()); // enable all cors requests

app.get('/results', (req, res) => { // handles http reqs from the client
    // constants for user input recieved from the client
    const passedType = req.query.type;
    const passedMag = req.query.mag; 
    const passedLocation = req.query.location;
    const passedDateRange = req.query.dateRange;
    const passedSortOption = req.query.sortOption;
  
    async function sendESRequest() { // send search requests to elasticsearch which retrieves earthquake documents
      const body = await client.search({
        index: 'earthquakes',
        body: {
          sort: [// sort search results
            {
              mag: {
                order: passedSortOption,
              },
            },
          ],
          size: 300, // retrieve up to 300 matching documents
          query: { // four queries to match user's criteria to be considered as a search result
            bool: {
              filter: [
                { // type of quake from dropdown 
                  term: { type: passedType }, // specific term of earthquake to be looked for in passedType
                },
                {
                  range: {
                    mag: {
                      gte: passedMag, 
                    },
                  },
                },
                {
                  match: { place: passedLocation },
                },
                {
                  range: {
                    '@timestamp': { // find doc between now and now minus passedDateRange (num of days selected)
                      gte: `now-${passedDateRange}d/d`, // greater than or equal to
                      lt: 'now/d', // less than 
                    },
                  },
                },
              ],
            },
          },
        },
      });
      res.json(body.hits.hits);
    }
    sendESRequest();
  });

const PORT = process.env.PORT || 3001;
// Instructs the server to listen for HTTP requests on port 3001 and prints a message to the console with the browser URL that can be used to test the server

app.listen(PORT, () => console.group(`Server started on ${PORT}`));