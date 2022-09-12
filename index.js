const express = require('express');
const app = express();
const { createClient } = require('redis')

app.use(express.json())

const client = createClient();

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err) => console.log('<:: Redis Client Error', err));


app.get('/credentials/:key', (req, res) => {
    const key = req.params.key.toString()
    client.get(key).then(r =>
        res.send(JSON.parse(r)));
});

app.post('/credentials/:key', (req, res) => {
    const key = req.params.key.toString();
    const sessionValue = req.body;

    client.set(key, JSON.stringify(sessionValue)).then(
        r => res.send(sessionValue));
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))
