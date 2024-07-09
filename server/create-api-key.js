const client = require('./elasticsearch/client');

async function generateApiKeys(opts) { // function creates an API key that gives access to the elastic cloud deployment
  const body = await client.security.createApiKey({
    body: { // defines what elasticsearch cluster privileges are granted to the server connecting with the generated API key
      name: 'earthquake_app', // name of server using the API key specifed
      role_descriptors: { // access privileges granted
        earthquakes_example_writer: {
          cluster: ['monitor'], // specify that this API key comes with cluster monitor privilege, which gives read-only access for determining cluster state
          index: [
            { // the key grants additional privileges 
              names: ['earthquakes'],
              privileges: ['create_index', 'write', 'read', 'manage'],
            },
          ],
        },
      },
    },
  });
  return Buffer.from(`${body.id}:${body.api_key}`).toString('base64'); // the security.createApiKey returns an id and api key value that is concatenated and encoded in base64
}

generateApiKeys() // prints API key in terminal
  .then(console.log)
  .catch((err) => { // prints error if occurs
    console.error(err);
    process.exit(1);
  });