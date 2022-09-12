const express = require('express');
const app = express();
const { createClient } = require('redis')

const client = createClient();

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err) => console.log('<:: Redis Client Error', err));


app.get('/credentials/:key', (req, res) => {
    const key = req.params.key.toString()
    client.get(key).then(r => res.send(`The value for the ${key} credential is ${r}`) );
});

app.post('/credentials/:key', (req, res) => {
    const key = req.params.key.toString();
    const value = req.query.value.toString();

    client.set(key, value).then(
        r => res.send(`Credential successfully added with ${key}: ${value}`))
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))
