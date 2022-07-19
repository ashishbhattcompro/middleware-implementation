// const { STATUS_CODES } = require("http");

// function mw1(req, res, next){
//   req.body["date"] = new Date();
//   console.log(`i'm mw1`);
//   next();
// }

// function mw2(req, res, next){
//   console.log(req.body.date);
//   console.log(`i'm mw2`);
//   next();
// }

module.exports = function (app) {

  // app.use(mw1);
  // app.use(mw2);

  const fs = require("fs");
  const Joi = require('joi');
  let data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

  // GET Requests
  app.get('/', (req, res) => {
    res.send(data);
  });

  app.get('/:id', (req, res) => {
    let id = req.params.id;
    let user = data.find(u => u.id === id);
    res.send(user);
  });


  // PUT Request

  const validatePut = function (req, res, next) {
    const schema = Joi.object({
      firstname: Joi.string().min(4).required(),
      lastname: Joi.string().min(3).required()
    });
    const { error } = schema.validate(req.body);
    if(error){
      return res.status(400).send(error.details[0].message);
    } else{
      next();
    }
  }


  app.put('/update/:id', [ validatePut ],  (req, res) => {
    const player = data.find(c => c.id === parseInt(req.params.id));
    if (!player) {
      res.status(404).send('<h2>Not Found!! </h2>');
    }

    data.forEach(c => {
      if(c.id === parseInt(req.params.id)){
        c.firstname = req.body.firstname;
        c.lastname = req.body.lastname;
        c.username = c.firstname.substring(0, 4) + c.lastname.substring(0, 4);
      }
    });

    const jsonString = JSON.stringify(data);
    fs.writeFile('./data.json', jsonString, err => {
      if (err) {
        console.log('Error in updating file', err)
      } else {
        console.log('Successfully updated file')
      }
    });

    res.send(data);
  });

  // Delete Request...
  app.delete('/delete/:id', (req, res) => {
    const player = data.find(c => c.id === parseInt(req.params.id));

    if (!player) {
      res.status(404).send(`<h2>Payer doesn't Exists!! </h2>`);
    }

    const index = data.indexOf(player);

    if (index !== -1) data.splice(index, 1);
    const jsonString = JSON.stringify(data);
    fs.writeFile('./data.json', jsonString, err => {
      if (err) {
        console.log('Error in updating file', err)
      } else {
        console.log('Successfully updated file')
      }
    });
    res.status(200).send("deleted successfully");
  });

  // Post Request...

  const validatePostRequest = function (req, res, next) {
    const schema = Joi.object({
      id: Joi.number().required(),
      firstname: Joi.string().min(4).required(),
      lastname: Joi.string().min(3).required(),
      username: Joi.string().min(4).required()
    });
    const { error } = schema.validate(req.body);
    if(error){
      return res.status(400).send(error.details[0].message);
    } else{
      next();
    }
  }


  app.post('/add', [ validatePostRequest ], function (req, res) {
    const isPlayer = data.find(c => c.id === parseInt(req.body.id));

    if (isPlayer) {
      res.send('<h2>Player Already Exists!! </h2>');
    }

    const player = {
      id: req.body.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username
    };
    data.push(player);
    const jsonString = JSON.stringify(data);
    fs.writeFile('./data.json', jsonString, err => {
      if (err) {
        console.log('Error in updating file', err)
      } else {
        console.log('Successfully updated file')
      }
    });
    res.send(player);
  });
}

