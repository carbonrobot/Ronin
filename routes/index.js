var express = require('express'),
    mongo = require('mongodb'),
    router = express.Router();

var server = 'mongodb://127.0.0.1:27017/ronindb';

var getProfile = function (key, callback) {
    mongo.connect(server, function (err, db) {
        var collection = db.collection('profiles');
        collection.findOne({ key: key }, function (err, doc) {
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
router.get('/:key/view', function (req, res) {
    getProfile(req.params.id, function (result) {
        res.render('view', { key: req.params.key, value: JSON.stringify(result, null, '\t') });
    });
});

// get complete profile
router.get('/:key', function (req, res) {
    getProfile(req.params.key, function (result) {
        res.send(result);
    });
});

// get partial profile
router.get('/:key/app/:appid', function (req, res) {
    getProfile(req.params.key, function (result) {
        for (var i = 0; i < result.apps.length; i++) {
            if (result.apps[i].key != req.params.appid) {
                results.apps.splice(i, 1);
            }
        }
        res.send(result);
    });
});

// update profile
router.post('/:key/:setting', function (req, res) {
    res.send({ "setting": req.params.setting, "req": req });
});

module.exports = router;
