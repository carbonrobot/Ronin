var express = require('express'),
    mongo = require('mongodb'),
    router = express.Router();

var server = 'mongodb://127.0.0.1:27017/ronindb';

var getProfile = function (key, callback) {
    mongo.connect(server, function (err, db) {
        var collection = db.collection('profiles');
        collection.findOne({ key: key }, function (err, doc) {
            db.close();
            callback(doc);
        });
    });
};
var getOrCreateProfile = function (key, callback) {
    getProfile(key, function (result) {
        if (result == null) {
            updateProfile({ key: key }, callback);
        }
        else{
            callback(result);
        }
    });
};
var updateProfile = function (profile, callback) {
    mongo.connect(server, function (err, db) {
        var collection = db.collection('profiles');
        collection.save(profile, function (err, doc) {
            db.close();
            callback(doc);
        });
    });
};

// doc page
router.get('/', function (req, res) {
    res.render('index', { host: req.headers.host });
});

// view profile
router.get('/:key/view', function (req, res) {
    getProfile(req.params.key, function (result) {
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
        if (result['apps'] != undefined) {
            for (var i = 0; i < result.apps.length; i++) {
                if (result.apps[i].key != req.params.appid) {
                    results.apps.splice(i, 1);
                }
            }
        }
        res.send(result);
    });
});

// update single global setting
router.post('/:key/:setting', function (req, res) {
    getOrCreateProfile(req.params.key, function (profile) {

        if (req.get('content-type') == 'application/x-www-form-urlencoded') {
            profile[req.params.setting] = req.body.value;

            updateProfile(profile, function () {
                res.send(200);
            });
        }
        else {
            res.send(400, 'Incorrect Content-Type. Use application/x-www-form-urlencoded to post a value.');
        }

    });
});

// update multiple global settings
router.post('/:key', function (req, res) {
    getOrCreateProfile(req.params.key, function (profile) {

        if (req.get('content-type') == 'application/json') {
            for (var k in req.body) {
                profile[k] = req.body[k];
            }

            updateProfile(profile, function () {
                res.send(profile);
            });
        }
        else {
            res.send(400, 'Incorrect Content-Type. Use application/json to post multiple values.');
        }

    });
});

// update single app settings
router.post('/:key/app/:appid/:setting', function (req, res) {
    getOrCreateProfile(req.params.key, function (profile) {

        if (req.get('content-type') == 'application/x-www-form-urlencoded') {
            var v = req.body.value;

            updateProfile(profile, function () {
                res.send(200);
            });
        }
        else {
            res.send(400, 'Incorrect Content-Type. Use application/x-www-form-urlencoded to post a value.');
        }

    });
});

module.exports = router;
