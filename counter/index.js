const express = require('express');
const redis = require('redis');

const app = express();

const client = redis.createClient({
	host: 'redis-server',
	port: 6379
});

client.set('counter', 0);

app.get('/', (req, resp) => 
	{
	console.log('new request');
	//process.exit(0);
	client.get('counter', (err,counter) => {
		resp.send('Counter: ' + counter);
		client.set('counter', parseInt(counter) + 1);
	});
});

app.listen(8080, () => {
	console.log("server listening on port 8080");
});
