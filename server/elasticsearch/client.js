// elasticsearch library that is the official node.js client for elasticsearch
const { Client } = require('@elastic/elasticsearch');
const config = require('config'); // dependency

const elasticConfig = config.get('elastic'); // access credentials stored in config using dependency under elastic to securely store and access sensitive data and not in the source code

// created an instance of elasticsearch cleint with access credentials pointing to the elasticsearch cluster
const client = new Client({
  cloud: {
    id: elasticConfig.cloudID,
  },
  auth: {
    apiKey: elasticConfig.apiKey
    // username: elasticConfig.username,
    // password: elasticConfig.password
  },
});
// checks if the elasticsearch cluster is up and available to process requests
client.ping()
  .then(response => console.log("You are connected to Elasticsearch!")) // when up
  .catch(error => console.error("Elasticsearch is not connected.")) // error

module.exports = client;  