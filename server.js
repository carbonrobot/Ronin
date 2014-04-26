// express, now with friends!
var express = require('express'),
    mongo = require('mongodb'),
    server = 'mongodb://127.0.0.1:27017/ronindb',
    app = express();


// logging
app.use(function(err, req, res, next) {
    console.error(err.stack);
    next(err);
});

// index page, upload file form
app.get('/:id', function (req, res) {
    mongo.connect(server, function (err, db) {
        var collection = db.collection('profiles');
        collection.findOne({id: "trixie"}, function (err, doc) {
            res.send(doc);
            db.close();
        });
        
    });
});

// upload
app.post('/:id', function (req, res) {
    res.send({ "v": "post", "id": req.params.id });
});

// thundercats, GO!
var port = process.env.PORT || 4337;
app.listen(port);