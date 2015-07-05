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

// Small file so it is not necessary to create extra files/directory for this Model
var Person = mongoose.model('User', mongoose.Schema({ name: String, age: Number, title: String }), 'users');

app.get('/people', function(req, res) {

  Person.find().exec(function(err, people) {
    if(err) {
      res.render('error', { status: 500 });
    }

    res.json(people)
  });

});

app.get('/delete', function(req, res) {
  var name = req.query.name;

  Person.findOneAndRemove({name: name}, function(err, data) {
    if(err) {
      res.render('error', { status: 500 })
    }

    console.log('Returned data from delete:', data)

    res.redirect('/people');


  })
});

app.get('/create', function(req, res) {
  var name = req.query.name,
      title = req.query.title,
      age = req.query.age;

      var person = new Person({name: name, title: title, age: age});
      person.save(function(err, newPerson) {
        if(err) {
          res.render('error', { status: 500, msg: 'Error creating new person' });
        }

        res.redirect('/people');
      })
})

app.get('/update', function(req, res) {
  var name = req.query.name;

  Person.findOne({name: name}, function(err, person) {

    if(err) {
      res.redirect('/people');
    }

    if(!person) {
      res.redirect('/people');
    }

    var oChanges = req.query.change;
    for(var prop in oChanges) {
      person[prop] = oChanges[prop];
    }

    person.save(function(err, updatedPerson) {

      if(err) {
        res.render('error', { status: 500, msg: 'Error updating ' + person });
      }

      res.redirect('/people');
    });
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
