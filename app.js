const express = require('express');
const app = express();
app.use(express.json());
require('./routes')(app);
const Joi = require('joi');
const port = 3000;

app.listen(port, () => {
    console.log(`app1 listening on port ${port}...`)
})