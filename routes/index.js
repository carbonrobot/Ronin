var express = require('express'),
    mongo = require('mongodb'),
    router = express.Router();

var server = 'mongodb://127.0.0.1:27017/ronindb';

var getProfile = function (id, callback) {
    mongo.connect(server, function (err, db) {
        var collection = db.collection('profiles');
        collection.findOne({ id: id }, function (err, doc) {
            callback(doc);
            db.close();
        });

    });
};

// doc page
router.get('/', function (req, res) {
    res.render('index', { host: req.headers.host });
});

// view profile
router.get('/:id/view', function (req, res) {
    getProfile(req.params.id, function (result) {
        res.render('view', { id: req.params.id, value: JSON.stringify(result, null, '\t') });
    });
});

// get profile
router.get('/:id', function (req, res) {
    getProfile(req.params.id, function (result) {
        res.send(result);
    });
});

// update profile
router.post('/:id', function (req, res) {
    res.send({ "v": "post", "id": req.params.id });
});

module.exports = router;
