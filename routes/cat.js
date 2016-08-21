require('colors');

//DB Info
var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('let_categories');

var Category = function (data) {
    this.data = data;
}
var Categories = function (data) {
    this.categories = data;
}
Category.prototype.data = {}

Category.prototype.changeName = function (name) {
    this.data.name = name;
}

Category.getById = function (id, callback) {
    //Search School Parameters
    db.get(id, function (err, body) {
        if (err) {
            return res.status(err.statusCode).json({});
        }

        //delete body._id;
        delete body._rev;
        callback(null, new Category(data));
    });
};

Category.getAll = function (callback) {
    db.list({'include_docs': true, 'attachments': true, 'limit': undefined, 'descending': false}, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        console.log(body.rows)
        callback(null, new Categories(body.rows));
    });
};


Category.new = function (data, callback) {
    db.insert(data, function (err) {
        if (err)
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        else {
            console.log('New category was inserted'.green);

            res.status(200).json();
        }
    });
};

module.exports = Category;