var jsonQuery = require('json-query');

var Schools = require("./models/Schools.js");
var Students = require("./models/Students.js");


exports.editSchool = function (req, res) {
    Schools.getById(req.body.id, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //sets new data
        body.set('name', req.body.name);
        body.set('address', req.body.address);
        body.set('b64', req.body.b64);
        //saves it
        Schools.update(req.body.id, body.data, function (err) {
            if (err) {
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            }
            res.status(200).json({});
        });
    });
};

exports.get = function (req, res) {

    var id = req.params.id;
    Schools.getById(id, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //delete body._id;
        delete body._rev;
        res.status(200).json(body.data);
    });
};

exports.getAll = function (req, res) {

    Schools.getAll(function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        res.status(200).json(body.data);
    });
};

exports.getClassInfo = function (req, res) {

    var idSchool = req.params.school;
    var idClass = req.params.class;

    Schools.getById(idSchool, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //delete body._id;
        delete body.data._rev;
        delete body.data._attachments;

        //Obtem os dados da turma
        body.data = jsonQuery('[classes][_id=' + idClass + ']', {data: body.data}).value;

        Students.getByClass(idClass, function (err, students) {
            if (err) {
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            }
            body.data.students = students.data;
            res.status(200).json(body.data);
        })
    });
};

exports.new = function (req, res) {
    if (req.body.name && req.body.address && req.body.b64) {
        var presentYear = new Date().getFullYear();
        var school = {
            "name": req.body.name,
            "address": req.body.address,
            "classes": [],
            "b64": req.body.b64
        }
        for (var i = 0; i < req.body.classes.length; i++) {
            //Generate New Class Skeleton
            var newClass = {
                _id: "T" + presentYear + req.body.classes[i].year + new Date().getTime() + i,
                name: req.body.classes[i].name,
                year: req.body.classes[i].year,
                scholarYear: presentYear,
                profs: []
            };

            //Add New Class Skeleton to School
            school.classes.push(newClass);
        }
        Schools.add(school, function (err) {
            if (err) {
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            }
            res.status(200).json({});
        });
    }
    else {
        console.log('Required Arguments Missing'.green);
        res.status(406).json({});
    }
};

exports.newClass = function (req, res) {

    if (req.body.name && req.body.year) {
        var presentYear = new Date().getFullYear();
        Schools.getById(req.params.id, function (err, body) {
            if (err) {
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            }
            //Generate New Class Skeleton
            var newClass = {
                _id: "T" + presentYear + req.body.year + new Date().getTime() + (body.data.classes.length + 1),
                name: req.body.name,
                //Pass it to integer
                year: parseInt(req.body.year),
                scholarYear: presentYear,
                profs: []
            };

            //Add New Class Skeleton to School
            body.data.classes.push(newClass);

            //Update School
            //saves it
            Schools.update(body.id, body.data, function (err) {
                if (err) {
                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                res.status(200).json({});
            });

        });

    } else {
        console.log('Parameters Missing');
        res.send(401, {error: "Alguns parametros são de preenchimento obrigatório"});
    }


};

exports.removeClass = function (req, res) {

    Students.getAll(function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //Se a turma a ser apagada não possuir alunos
        if (JSON.stringify(body.data).indexOf(req.body._id) == -1) {
            Schools.getById(req.params.id, function (err, body1) {
                if (err) {
                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                //Search For The Correct Class
                for (var c in body1.data.classes) {
                    //Remove Class
                    if (body1.data.classes[c]._id == req.body._id) {
                        body1.data.classes.splice(c, 1);
                    }
                }
                //saves it
                Schools.update(body1.data.id, body1.data, function (err) {
                    if (err) {
                        return res.status(500).json({
                            'result': 'nok',
                            'message': err
                        });
                    }
                    res.status(200).json({});
                });
            });
        } else {
            return res.status(403).json({
                'result': 'A turma seleccionada tem alunos associados e não pode ser apagada.'
            });
        }
    });
};

exports.removeSchool = function (req, res) {

    Students.getAll(function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //Se a escola a ser apagada não possuir alunos
        if (JSON.stringify(body.data).indexOf(req.params.id) == -1) {
            //Search School Info
            Schools.getById(req.params.id, function (err, body1) {
                if (err) {
                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                //Search School Info
                Schools.delete(body1.data._id, body1.data._rev, function (err) {
                    if (err) {
                        console.log(err)
                        //Report Error (School Doenst Exists)
                        console.log("Error Removing School");
                        return res.status(500).json({
                            'result': 'nok',
                            'message': err
                        });
                    }
                    console.log("School Removed");
                    return res.status(200).json({});

                });
            });

        } else {
            return res.status(403).json({
                'result': 'A escola seleccionada tem alunos associados e não pode ser apagada.'
            });
        }
    });
};

