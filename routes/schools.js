require('colors');

//DB Info
var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('dev_escolas');

//Get School ID Info
exports.get = function (req, res) {

    var id = req.params.id;
    console.log('school get: '.green + id);

    //Search School Parameters
    db.get(id, function (err, body) {
        if (err) {
            return res.status(err.statusCode).json({});
        }

        //delete body._id;
        delete body._rev;
        delete body._attachments;

        res.status(200).json(body);
    });
};

exports.new = function (req, res) {

    console.log(req.body)
    //Check For Required Fields
    if (req.body.name && req.body.address && req.body.b64) {

        var school = {
            "name": req.body.name,
            "address": req.body.address,
            "classes": [],
            "b64": req.body.b64
        }
        var id = "School" + new Date().getTime();
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
    console.log('schools getAll'.yellow);

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

//NEW
exports.editSchool = function (req, res) {
    if (req.body.name != '' && req.body.address != '') {
        //Fetch School
        console.log('Edit School: Fetching School ' + req.params.id + ''.green);

        //Search School Info
        db.get(req.params.id, function (err, body) {

            if (err) {
                //Report Error (School Doenst Exists)
                console.log("Error Editing School");
                return res.status(err.statusCode).json({});
            }
            else {

                body.name = req.body.name;
                body.address = req.body.address;

                if (req.body.b64 != '')
                    body.b64 = req.body.b64;

                db.insert(body, body._id, function (err) {

                    if (err) {
                        //Report Error (School Doenst Exists)
                        console.log("Error Editing School");
                        return res.status(err.statusCode).json({});
                    }
                    else {
                        console.log("School Edited");
                        return res.status(200).json({});
                    }

                });

            }

        });

    }
    else {
        console.log('Parameters Missing');
        res.send(401, {error: "Alguns parametros são de preenchimento obrigatório"});
    }


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

exports.newClass = function (req, res) {

    //Fetch School
    console.log('Fetching School' + req.params.id + ''.green);
    console.log(req.body);
    if (req.body.name && req.body.year) {
        var presentYear = new Date().getFullYear();

        db.get(req.params.id, function (err, body) {

            if (err) {
                res.send(err.statusCode, {error: "Erro ao procurar escola"});
            }
            else {

                //Generate New Class Skeleton
                var newClass = {
                    _id: "T" + presentYear + req.body.year + new Date().getTime() + (body.classes.length + 1),
                    name: req.body.name,
                    year: req.body.year,
                    scholarYear: presentYear,
                    profs: []
                };

                //Add New Class Skeleton to School
                body.classes.push(newClass);

                console.log(body.classes);
                //Update School
                db.insert(body, body._id, function (err) {
                    if (err) {
                        res.send(err.statusCode, {error: "Erro ao inserir turma na escola"});
                    }
                    else {
                        console.log('New class was inserted into the school'.green);
                        res.status(200).json({});
                    }
                });

            }

        });
    } else {
        console.log('Parameters Missing');
        res.send(401, {error: "Alguns parametros são de preenchimento obrigatório"});
    }


}

exports.removeClass = function (req, res) {

    //Fetch School
    console.log('Fetching School' + req.params.id + 'do delete class'.green);
    db.get(req.params.id, function (err, body) {

        if (err) {
            //Report Error (School Doenst Exists)
            res.send(err.statusCode, {error: "Erro ao procurar escola"});
        }
        else {

            //Search For The Correct Class
            for (var c in body.classes) {

                //Remove Class
                if (body.classes[c]._id == req.body._id) {
                    body.classes.splice(c, 1);
                }

            }

            //Update School
            db.insert(body, body._id, function (err) {
                if (err) {
                    res.send(err.statusCode, {error: "Erro ao apagar turma da escola"});
                }
                else {
                    console.log('Class Removed Successfully'.green);
                    res.status(200).json({});
                }
            });

        }

    });

};