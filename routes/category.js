require('colors');

//DB Info
var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('let_categories');

//Get category by ID
exports.get = function (req, res) {

    var id = req.params.id;
    console.log('category get: '.green + id);

    //Search School Parameters
    db.get(id, function (err, body) {
        if (err) {
            return res.status(err.statusCode).json({});
        }

        //delete body._id;
        delete body._rev;
        res.status(200).json(body);
    });
};

exports.new = function (req, res) {

    //Check For Required Fields
    if (req.body.name && req.body.address && req.body.b64) {

        var category = {
            "subject": req.body.subject,
            "morada": req.body.address,
            "turmas": [],
            "b64": req.body.b64
        }
        var id = "NEW|Escola" + new Date().getTime();
        db.insert(school, id, function (err) {
            if (err)
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            else {
                console.log('New school was inserted'.green);

                res.status(200).json([id]);
            }
        })

    }
    else {
        console.log('Required Arguments Missing'.green);
        res.status(406).json({});
    }


};

exports.getAll = function (req, res) {
    console.log('category getAll'.yellow);

    db.list({'include_docs': true, 'attachments': true, 'limit': undefined, 'descending': false}, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        res.json(body.rows);
    });
};


exports.removeSchool = function (req, res) {

    //Fetch School
    console.log('Remove School: Fetching School ' + req.params.id + ''.green);

    //Search School Info
    db.get(req.params.id, function (err, body) {

        if (err) {
            //Report Error (School Doenst Exists)
            console.log("Error Removing School");
            return res.status(err.statusCode).json({});
        }
        else {

            db.destroy(body._id, body._rev, function (err) {

                if (err) {
                    //Report Error (School Doenst Exists)
                    console.log("Error Removing School");
                    return res.status(err.statusCode).json({});
                }
                else {
                    console.log("School Removed");
                    return res.status(200).json({});
                }

            });

        }

    });


};