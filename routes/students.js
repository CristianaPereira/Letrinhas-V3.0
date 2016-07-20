require('colors');

var nano = require('nano')(process.env.COUCHDB);

var db = nano.use('let_students');
var dbe = nano.use('let_schools');
var dbTests = nano.use('let_tests');
var dbSchools = nano.use('let_schools');
var dbResolutions = nano.use('let_resolutions');

var jsonQuery = require('json-query');
exports.new = function (req, res) {

    //console.log(req.body)
    //Verify Fields
    if (JSON.stringify(req.body).indexOf('""') == -1) {
        //verifica se o username nao esta a ser utilizado
        exists(req.body.username.trim().toLowerCase(), function (exists) {
            if (!exists) {
                //!TEMPORARY! - Separating Class From School
                var newStudent = {
                    "school": req.body.school,
                    "name": req.body.name,
                    "b64": req.body.b64,
                    "number": req.body.number,
                    "password": req.body.password,
                    "username": req.body.username.trim().toLowerCase(),
                    "class": req.body.class
                };

                db.insert(newStudent, function (err) {
                    if (err)
                        return res.status(err.statusCode).json({});
                    else {
                        console.log('New student was inserted'.green);
                        res.send(200, {text: "Aluno inserido com sucesso!"});
                    }
                })
            } else {
                res.send(401, {text: "O nome de utilizador escolhido ja esta a ser utilizado"});
            }
        });

    }
    else {
        console.log("Fields Missing");
        res.send(401, {text: "Todos os campos sao de preenchimento obrigatório"});
    }

};
//Verifica se o nome de utilizador ja esta a ser utilizado
exports.exist = function (req, res) {
    exists(req.body.username, function (exists) {
        res.json(exists);
    })
};


exports.get = function (req, res) {
    var id = req.params.id;
    console.log('student get: '.green + id);

    db.get(id, function (err, body) {
        if (err) {
            return res.status(err.statusCode).json({});
        }

        res.json(body);
    });
};
exports.getInfo = function (req, res) {
    var id = req.params.id;
    console.log('student get: '.green + id);

    db.get(id, function (err, studentData) {
        if (err) {
            return res.status(err.statusCode).json({});
        }
        dbTests.list({
            'include_docs': true, 'attachments': true,
            'limit': undefined, 'descending': false
        }, function (err, testsData) {
            if (err) {
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            }
            //Recolhe os testes do aluno
            var studentTests = jsonQuery('[doc][*studentID=' + id + ']', {data: testsData.rows}).value;
            //console.log(studentTests)
            //Adiciona-os ao json da view o nr de testes por resolver

            studentData.unsolvedTests = jsonQuery('[*solved=false]', {data: studentTests}).value || [];
            studentData.solvedTests = jsonQuery('[*solved=true]', {data: studentTests}).value || [];
            dbResolutions.list({
                'include_docs': true, 'attachments': true,
                'limit': undefined, 'descending': false
            }, function (err, resolData) {
                if (err) {
                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                //Recolhe os testes do aluno
                var resolutions = jsonQuery('[doc][*studentID=' + id + '& note != -1]', {data: resolData.rows}).value;
                for (var i = 0; i < resolutions.length; i++) {
                    console.log(resolutions[i])
                }

                //Adiciona-os ao json da view
                studentData.resolutions = resolutions || [];

                //Obtem o nome da escola e da turma
                //Search School Parameters
                dbSchools.get(studentData.school, function (err, school) {
                    if (err) {
                        return res.status(err.statusCode).json({});
                    }
                    studentData.schoolName = school.name;
                    var classe = jsonQuery('[classes][_id=' + studentData.class + ']', {data: school}).value;
                    studentData.classe = classe.year + "º " + classe.name;
                    res.json(studentData);
                });

            });
        });

    });
};
//NEW
exports.editStudent = function (req, res) {

    console.log(req.body)
    if (JSON.stringify(req.body).indexOf('""') == -1) {
        //Fetch School
        console.log('Edit Student: Fetching Student ' + req.params.id + ''.green);
        //Search School Info
        db.get(req.params.id, function (err, body) {
            if (err) {
                //Report Error (School Doenst Exists)
                console.log("Error Editing Student");
                res.send(err.statusCode, {error: "Aluno Invalido"});
            }
            else {
                body.name = req.body.name;
                body.number = req.body.number;
                body.school = req.body.school;
                body.class = req.body.class;

                if (req.body.b64 != '')
                    body.b64 = req.body.b64;
                db.insert(body, body._id, function (err) {
                    if (err) {
                        //Report Error (Student Doesn't Exists)
                        console.log("Error Editing Student");
                        res.send(err.statusCode, {error: "Aluno Invalido"});
                    }
                    else {
                        console.log("Student Edited");
                        res.send(200, {text: "Os dados do aluno" + body.name + "foram alterados com sucesso!"});
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

exports.getAll = function (req, res) {

    var user = req.params.userID;
    console.log('getting my students :' + user.bgBlue);
    var escolas = [];

    //Get Teacher Classes
    dbe.list({
        'include_docs': true,
        'attachments': false,
        'limit': undefined,
        'descending': true
    }, function (err, body) {
        if (err) {
            console.log(err)
            return res.status(err.statusCode, {error: "Erro a procurar alunos"});
        }
        console.log("schools")
        console.log(body)
        //Fetch Classes

        for (var i in body.rows) {

            for (var j in body.rows[i].doc.classes) {

                for (var k in body.rows[i].doc.classes[j].profs) {

                    if (body.rows[i].doc.classes[j].profs[k]._id == user)
                        escolas.push({
                            "_id": body.rows[i].doc.classes[j]._id,
                            "details": body.rows[i].doc.name + ", " + body.rows[i].doc.classes[j].year + "º " + body.rows[i].doc.classes[j].name
                        })
                    //classes.push({"_id": body.rows[i].doc.classes[j]._id});
                }
            }
        }
        console.log(escolas)
        //Fetch Students From Classes
        db.list({
            'include_docs': true,
            'attachments': false,
            'limit': undefined,
            'descending': true
        }, function (err, body2) {
            if (err) {
                return res.status(err.statusCode).json({});
            }
            var students = body2.rows;

            //Filtra "os meus alunos"
            //Adiciona a string da escola

            var myStudents = [];
            for (var i = 0; i < students.length; i++) {
                //Remove a password dos campos enviados para a view
                delete students[i].doc.password;
                //Adiciona o campo com o nome da escola e aturma por extenso
                for (var esc in escolas) {
                    if (escolas[esc]._id == students[i].doc.class) {
                        students[i].doc.schoolDetails = escolas[esc].details;
                        myStudents.push(students[i])
                    }
                }
            }
            //console.log(myStudents)
            // console.log(jsonQuery('doc', {data: myStudents}).value)
            res.json(jsonQuery('doc', {data: myStudents}).value);
        });
    });
};

exports.removeStudent = function (req, res) {

    //Fetch Student
    console.log('Remove Student: Fetching Student ' + req.params.id + ''.green);

    //Search Student Info
    db.get(req.params.id, function (err, body) {

        if (err) {
            //Report Error (Student Doenst Exists)
            console.log("Error Removing Student");
            return res.status(err.statusCode).json({});
        }
        else {
            db.destroy(body._id, body._rev, function (err) {

                if (err) {
                    //Report Error (Student Doenst Exists)
                    console.log("Error Removing Student");
                    return res.status(err.statusCode).json({});
                }
                else {
                    console.log("Student Removed - Removing tests and resolutions");
                    dbTests.list({
                        'include_docs': true,
                        'limit': undefined,
                        'descending': true
                    }, function (err, solvedTests) {
                        if (err) {
                            return res.status(500).json({
                                'result': 'nok',
                                'message': err
                            });
                        }
                        //Apaga os testes desse aluno
                        var tests = jsonQuery('[doc][*studentID=' + body._id + ']', {data: solvedTests.rows}).value
                        for (var t = 0; t < tests.length; t++) {
                            dbTests.destroy(tests[t]._id, tests[t]._rev, function (err) {

                                if (err) {
                                    console.log("test not Removed".red);
                                }
                                else {
                                    console.log(t + 1 + "test Removed".green);
                                }
                            });
                        }
                        console.log("Tests Removed");
                        dbResolutions.list({
                            'include_docs': true,
                            'limit': undefined,
                            'descending': true
                        }, function (err, resolutions) {
                            if (err) {
                                return res.status(500).json({
                                    'result': 'nok',
                                    'message': err
                                });
                            }
                            //Apaga os testes desse aluno
                            var resol = jsonQuery('[doc][*studentID=' + body._id + ']', {data: resolutions.rows}).value
                            for (var r = 0; r < r.length; t++) {
                                dbTests.destroy(resol[r]._id, resol[r]._rev, function (err) {

                                    if (err) {
                                        console.log("resolution not Removed".red);
                                    }
                                    else {
                                        console.log(t + 1 + "resolution Removed".green);
                                    }
                                });
                            }
                            console.log("Resolutions Removed");
                            return res.status(200).json({});
                        })
                    })
                }
            });
        }
    });


};

function exists(username, callback) {
    //Fetch Students From Classes
    db.list({
        'include_docs': true,
        'attachments': false,
        'limit': undefined,
        'descending': true
    }, function (err, studentsList) {
        if (err) {
            return res.status(err.statusCode).json({});
        }
        //Verica se o username ja esta em uso
        var student = jsonQuery('rows[doc][*username=' + username + ']', {data: studentsList}).value;

        if (student.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

