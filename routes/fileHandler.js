require('colors');
var request = require('request');

exports.fileDownload = function (req, res) {

    var id = req.params.id;
    var db = req.params.db;
    var photo = req.params.filename;

    request({
        'url': process.env.COUCHDB + '/' + db + '/' + id + '/' + photo, headers: {
            "Authorization": "Basic " + new Buffer(process.env.USERNAME + ":" + process.env.PASSWORD).toString("base64")
        }
    }).pipe(res);
    

};