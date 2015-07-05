var express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    fs = require('fs');

var application_root = __dirname;

var app = express();

mongoose.connect('mongodb://localhost/testdb')
mongoose.connection.once('connected', function() {
  console.log('Mongo Connection: ok');
})

var Person = mongoose.model('User', mongoose.Schema({ name: String, age: Number, title: String }), 'users');

app.get('/people', function(req, res) {

  Person.find().exec(function(err, people) {
    if(err) {
      res.render('error', { status: 500 });
    }

    res.json(people)
  });

});

app.get('/people/:name', function(req, res) {
  Person.find({'name': req.params.name}).exec(function(err, person) {

    if(err) {
      res.render('error', { status: 500 });
    }

    console.log('Found:', person);
    res.json(person);

  });
});




app.listen(3000, function() {
  console.log('Server listening on port %d', 3000);
});

























//
