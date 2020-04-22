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

const { Pool } = require('pg');
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT)').catch(err => console.log(err));

console.log(keys);

app.get('/:number', (req, resp) => {
  const number = req.params.number;
  redisClient.get(number, (err, result) => {
    //jezeli jest wynik w cachu
    if (result) {
      if (result === "1"){
        resp.send("(cache) TAK");
      }
      else {
        resp.send("(cache) NIE")
      }
    }
    else {
      const wynik = test_prime(number);
      //przypisujac inaczej wartosci redisowi aplikacja potrafi sie wywalic
      if (wynik === 1) {
        redisClient.set(number, 1);
        resp.send("TAK");
      }
      else {
        redisClient.set(number, 0);
        resp.send("NIE");
      }
      //wpisywanie do bazy danych 0 i 1 bez zadnej innej informacji jest bez sensu ale zrobione aby sie nauczyc
      pgClient.query('INSERT INTO results(number) VALUES($1)', [wynik], (err, res) => {
        if (err) {
          console.log(err.stack);
        };
      })
    };
  });
});

app.get('/', (req, resp) => {
	resp.send('Nie podales liczby');
});

app.listen(4000, err => {
	console.log('Server listening on port 4000');
});

const test_prime = (n) => {
  if (n===1) {
    return 0;
  }
  else if(n === 2) {
    return 1;
  } 
  else {
    for(var x = 2; x < n; x++) {
      if(n % x === 0) {
        return 0;
      }
    }
    return 1;  
  }
}