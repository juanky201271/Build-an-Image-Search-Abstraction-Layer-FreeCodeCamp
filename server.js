'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var MongoClient = require('mongodb');
var ObjectId    = require('mongodb').ObjectID;
const fetch     = require('node-fetch');


var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const CONNECTION_STRING = process.env.MONGO_URI; 
MongoClient.connect(CONNECTION_STRING, function(err, db) {
if(err) {
      console.log('Database error: ' + err);
  } else {
      console.log('Successful database connection');
      
    //Index page (static HTML)
    app.route('/')
      .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
      });

    app.route('/api/imagesearch/:text')
      .post(function (req, res) {
        var text = req.params.text || '';
        var offset = req.body.offset || 10;
      
        if (text === '' || text === undefined) {
          res.json('Text for searching is required!');
        }
        var result = [];
        const url = process.env.GOOGLE_URI + "?key=" + process.env.KEY + "&cx=" + process.env.CX + "&q=" + text + "&searchType=image&num=" + offset;
        //console.log(url);
        fetch(url)
        .then(res => res.json())
        .then((data) => {
          data.items.map((ele) => {
            result.push({
              snippet: ele.snippet,
              link: ele.link,
              contextLink: ele.image.contextLink,
              thumbnailLink: ele.image.thumbnailLink
            })
          });
          var j = {
            term: text,
            when: new Date,
            items: result
          };
          db.collection('ISAL-queries').insertOne(j, (err, doc) => {
            if(err) {
                res.json('could not add');
            } else {
                res.json(result);
            }
          });
        })
        .catch(console.log);
      })
    .get(function (req, res) {
        var text = req.params.text || '';
        var offset = req.query.offset || 10;
      
        if (text === '' || text === undefined) {
          res.json('Text for searching is required!');
        }
        var result = [];
        const url = process.env.GOOGLE_URI + "?key=" + process.env.KEY + "&cx=" + process.env.CX + "&q=" + text + "&searchType=image&num=" + offset;
        //console.log(url);
        fetch(url)
        .then(res => res.json())
        .then((data) => {
          data.items.map((ele) => {
            result.push({
              snippet: ele.snippet,
              link: ele.link,
              contextLink: ele.image.contextLink,
              thumbnailLink: ele.image.thumbnailLink
            })
          });
          var j = {
            term: text,
            when: new Date,
            items: result
          };
          db.collection('ISAL-queries').insertOne(j, (err, doc) => {
            if(err) {
                res.json('could not add');
            } else {
                res.json(result);
            }
          });
        })
        .catch(console.log);
      });
    
    app.route('/api/latest/imagesearch/:id')
      .post(function (req, res) {
        var id = req.params.id || '';
        if (id === '' || id === undefined) {
          res.json('ID for searching is required!');
        }
        var jb = {
          _id: ObjectId(id)
        };
        db.collection('ISAL-queries').find(jb).toArray((err, doc) => {
          if(err) {
            res.json('could not find');
          } else {
            res.json(doc);
          }
        });
      })
    .get(function (req, res) {
        var id = req.params.id || '';
        if (id === '' || id === undefined) {
          res.json('ID for searching is required!');
        }
        var jb = {
          _id: ObjectId(id)
        };
        db.collection('ISAL-queries').find(jb).toArray((err, doc) => {
          if(err) {
            res.json('could not find');
          } else {
            res.json(doc);
          }
        });
      });
    
    app.route('/api/latest/imagesearch')
      .post(function (req, res) {
        var offset = Number(req.body.offset) || 10;
        var jb = {};
        var result = [];
        db.collection('ISAL-queries').find(jb).sort({ when: -1 }).limit(offset).toArray((err, doc) => {
          if(err) {
            res.json('could not find');
          } else {
            doc.map((ele) => {
              result.push({
                _id: ele._id,
                term: ele.term,
                when: ele.when
              })
            });
            res.json(result);
          }
        });
      })
      .get(function (req, res) {
        var offset = Number(req.query.offset) || 10;
        var jb = {};
        var result = [];
        db.collection('ISAL-queries').find(jb).sort({ when: -1 }).limit(offset).toArray((err, doc) => {
          if(err) {
            res.json('could not find');
          } else {
            doc.map((ele) => {
              result.push({
                _id: ele._id,
                term: ele.term,
                when: ele.when
              })
            });
            res.json(result);
          }
        });
      });

    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });

    //Start our server and tests!
    app.listen(process.env.PORT || 3000, function () {
      console.log("Listening on port " + process.env.PORT);

    });

  }
});

module.exports = app; //for testing
