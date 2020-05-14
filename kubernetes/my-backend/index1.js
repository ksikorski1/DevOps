const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000 
});

const appId = uuidv4();
const appPort = 5000;

app.get('/', (req, resp) => {
	resp.send('[${appId}] ${keys.initMessage}');
});

app.listen(5000, err => {
	console.log('Server listening on port ${appPort}');
});