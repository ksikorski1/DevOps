const express = require('express');
const redis = require('redis');

const app = express();

const client = redis.createClient({
	host: 'redis-server',
	port: 6379
});

client.set('counter', 0);

app.get('/', (req, resp) =>	{
	console.log('new request');
	//process.exit(0);
	client.get('counter', (err,counter) => {
		resp.send("Hello from node backend");
		client.set('counter', parseInt(counter) + 1);
	});
});

app.get('/silnia/:wartosc', (req, resp) => {
	const silnia = req.params.wartosc;
	if (silnia > 10) {
		process.exit(1);
	}
	client.get(silnia, (err, result) => {
		if (result) {
			resp.send("Silnia " + silnia + " rowna sie " + result);
		}
		else {
			const wynik = factoralize(silnia);
			client.set(silnia, parseInt(wynik));
			resp.send("Silnia " + silnia + " rowna sie " + wynik);
		}
	});
});

const factoralize = (num) => {
    if (num === 0) {
        return 1;
    } else {
        return num * factoralize(num - 1);
    }
}

app.listen(8080, () => {
	console.log("server listening on port 8080");
});


