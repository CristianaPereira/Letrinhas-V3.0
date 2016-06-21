require('colors');

var nano = require('nano')(process.env.COUCHDB);
var dbTests = nano.use('let_tests');
var jsonQuery = require('json-query');

exports.getAll = function (req, res) {
    var user = req.params.userID;
    console.log('Getting all tests'.blueBG + ' : ' + req.params.userID.blue);

    dbTests.list({
        'include_docs': true, 'attachments': true,
        'limit': undefined, 'descending': false
    }, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        console.log(jsonQuery('[doc][*profID=' + user + ']', {data: body.rows}).value)
        res.json(jsonQuery('[doc][*profID=' + user + ']', {data: body.rows}).value);
    });

};