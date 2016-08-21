require('colors');

//DB Info
var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('let_schools');

var School = function (data) {
    this.data = data;
}

School.prototype.data = {}

School.prototype.get = function (name) {
    return this.data[name];
};

School.prototype.set = function (name, value) {
    if (value) {
        this.data[name] = value;
    }
};


School.add = function (data, callback) {
    db.insert(data, function (err) {
        //if an error occurs
        if (err) return callback(err);
        //else sends fetched data
        callback(null);
    });
};

School.delete = function (id, rev, callback) {
    console.log('Removing school')
    db.destroy(id, rev, function (err) {
        if (err) {
            console.log(err)
            callback(err);
        }
        callback(null);
    });
};

School.getById = function (id, callback) {
    //Search School Parameters
    console.log('Getting school by id');
    //gets data
    db.get(id, function (err, body) {
        //if an error occurs
        if (err) return callback(err);
        //else sends fetched data
        callback(null, new School(body));
    });
};

School.getAll = function (callback) {
    db.list({'include_docs': true, 'attachments': true, 'limit': undefined, 'descending': false},
        function (err, body) {
            //if an error occurs
            if (err) return callback(err);
            //else sends fetched data
            callback(null, new School(body.rows));
        });
};

School.update = function (id, data, callback) {
    db.insert(data, id, function (err) {
        //if an error occurs
        if (err) return callback(err);
        //else sends fetched data
        callback(null);
    });
};

module.exports = School;