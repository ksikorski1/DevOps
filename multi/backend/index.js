const keys = require('./keys');

const express = require("express");
const bodyParser = require ('body-parser');

const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pqUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to pg db'));

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT)').catch(err => console.log(err));

console.log(keys);

app.get('/', (req, resp) => {
    resp.send('Hello world');
});

/*
app.get('/nwd/:x/:y', (req, res) => {
    let x = parseInt(req.params.x);
    let y = parseInt(req.params.y);

    client.get(req.params.x + ',' + req.params.y, (err, result) => {
        if(result){
            res.send("Wynik: " + result);
            console.log("z redis: " + result);
        }
        else {
            result = nwd(x, y);
            client.set(req.params.x + ',' + req.params.y, result);
            res.send("Wynik: " + result);
            console.log("obliczone: " + result);
        }
    });
});
*/
app.listen(8081, err => {
    console.log("service listening on port 8081");
});

nwd = (x, y) => {
    if ((typeof x !== 'number') || (typeof y !== 'number')) 
      return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
      let t = y;
      y = x % y;
      x = t;
    }
    return x;
  };