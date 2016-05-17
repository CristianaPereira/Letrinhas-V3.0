require('colors');

var request = require('request');

//var nano = require('nano')('http://ince.pt:5984');
var nano = require('nano')(process.env.COUCHDB);
//var nano = require('nano')('http://185.15.22.235:5984');
//var db = nano.use('professores');
var db = nano.use('dev_professores');
var db2 = nano.use('dev_escolas');

nano.auth(process.env.USERNAME, process.env.PASSWORD, function (err, response, headers) {
    nano = require('nano')({
        url: process.env.COUCHDB,
        cookie: headers['set-cookie']
    });
    db = nano.use('dev_professores');
    db2 = nano.use('dev_escolas');
});

exports.new = function (req, res) {
    console.log('teachers new'.green);
    console.log(req.body);

    //Verify Fields
    if (JSON.stringify(req.body).indexOf('""') == -1) {
        var state = false;

        if (req.body.state == 1) {
            state = true;
        }
        var newteacher = {
            "state": state,
            "name": req.body.name,
            "password": req.body.password,
            "pin": req.body.pin,
            "phoneNumber": req.body.phoneNumber,
            "permissionLevel": parseInt(req.body.permissionLevel),
            "b64": req.body.b64,
        };

        db.insert(newteacher, req.body.email, function (err, body) {
            if (err)
                console.log("(L-131) - Não foi possivel inserir " + req.body.email + '\n' + "erro: " + err);
            else {
                res.json(body);
                console.log('New teacher ' + req.body.name + ' was inserted!'.green);
                var escolas = req.body.classes;

                for (var items in escolas) {
                    console.log("Associar escolsa :" + escolas[items].id + " ao prof" + req.body.email);
                    insertProfTurma(req.body.email, escolas[items].id, escolas[items].classes);
                    console.log("-------------");
                }
            }
        });


    } else {
        return res.status(500).json({
            'result': 'Campos em falta'
        });
    }


};

exports.updateDetails = function (req, res) {
    console.log('Teachers - UPDATE'.cyan);
    console.log(req.body)
    //Verify Fields
    if (JSON.stringify(req.body).indexOf('""') == -1) {
        db.get(req.body.id, function (err, body) {
            var state = false;

            if (req.body.state == 1) {
                state = true;
            }
            if (err) {
                console.log("(L-20) - Não foi possivel aceder a " + req.body.id + '\n'
                    + "erro: " + err);
                res.redirect('/teachers');
            }
            body.name = req.body.name;
            body.phoneNumber = req.body.phoneNumber;
            body.type = req.body.type;
            body.state = state;
            body.b64 = req.body.b64;

            db.insert(body, req.body.id, function (err, body) {
                if (err) {
                    console.log("(L-131) - Não foi possivel alterar " + req.body.id + '\n' + "erro: " + err);
                    return res.status(500).json({
                        'result': "Não foi possivel alterar " + req.body.id
                    });
                }
                else {
                    res.status(200).json({});
                    console.log('Updated teacher '.green + req.body.name + '!');
                }
            });
        });

    } else {
        return res.status(500).json({
            'result': "Campos em falta"
        });
    }
};

exports.editPasswd = function (req, res) {
    console.log('Teachers - UPDATE'.cyan);
    console.log(req.body);
    //começo do upDate...
    db.get(req.body.id, function (err, body) {
        if (err) {
            console.log("(L-20) - Não foi possivel aceder a " + req.body.id + '\n'
                + "erro: " + err);
            res.redirect('/teachers');
        }
        //Se a palavara passe antiga estver correcta
        if (body.password == req.body.oldPswd) {
            body.password = req.body.newPswd;
            db.insert(body, req.body.id, function (err, body) {
                if (err) {
                    console.log("(L-131) - Não foi possivel alterar a passord de: " + req.body.id + '\n' + "erro: " + err);
                    return res.status(500).json({
                        'result': 'Não foi possivel alterar a passord'
                    });
                }
                else {
                    res.json(body);
                    console.log('Password alterada'.green + ':' + req.body.id);
                }
            });
        } else {
            return res.status(500).json({
                'result': 'Password antiga incorrecta'
            });
            console.log("Não foi possivel alterar a password.\n" + "erro: " + err);
        }

    });
};

exports.editClasses = function (req, res) {
    console.log(req.body)
    var escolas = JSON.parse(req.body.classes);
    for (var items in escolas) {
        insertProfTurma(req.body.id, escolas[items].id, escolas[items].classes);
    }
    res.redirect('/teachers/' + req.body.id);
};

exports.delete = function (req, res) {

    db.get(req.params.id, function (err, body) {
            if (err) {
                console.log("Nao foi possivel encontrar " + req.params.id + "\n " + err);
                return res.status(err.statusCode).json({});
            } else {
                db.destroy(body._id, body._rev, function (err) {
                    if (err) {
                        //Report Error (School Doenst Exists)
                        console.log("Error Removing TEACHER");
                        return res.status(err.statusCode).json({});
                    }
                    else {
                        console.log("tEACHER Removed");
                        //Remove o professor das turmas
                        //gets schools ans classes
                        db2.list({
                            'include_docs': true,
                            'attachments': true,
                            'limit': undefined,
                            'descending': false
                        }, function (err, schools) {
                            if (err) {
                                return res.status(500).json({
                                    'result': 'nok',
                                    'message': err
                                });
                            }
                            console.log(body.classes)
                            var schools = getClasses(schools, req.params.id);
                            for (var is = 0; is < schools.length; is++) {
                                for (var ic = 0; ic < schools[is].class.length; ic++) {
                                    console.log(schools[is].class[ic].id)
                                    removeProfTurma(req.params.id, schools[is].id, schools[is].class[ic].id, res);
                                }
                            }
                            //Return Result
                            res.json(body);
                        });

                        return res.status(200).json({});
                    }

                });
            }
        }
    );

};

exports.photo = function (req, res) {
    var id = req.params.id;
    var db = req.params.db;
    var photo = req.params.photo;

    request({
        'url': process.env.COUCHDB + '/' + db + '/' + id + '/' + photo, headers: {
            "Authorization": "Basic " + new Buffer(process.env.USERNAME + ":" + process.env.PASSWORD).toString("base64")
        }
    }).pipe(res);

};

exports.getAll = function (req, res) {
    console.log('teachers getAll'.yellow);

    db.list({'include_docs': true, 'attachments': true, 'limit': undefined, 'descending': true}, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
            console.log(err);
        }
        //Removes Sensitive Information

        //gets schools ans classes
        db2.list({
            'include_docs': true,
            'attachments': true,
            'limit': undefined,
            'descending': false
        }, function (err, schools) {
            if (err) {
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            }
            for (var items = 0; items < body.rows.length; items++) {
                delete body.rows[items].value;
                delete body.rows[items].doc._rev;
                delete body.rows[items].doc.password;
                delete body.rows[items].doc.pin;
                console.log(body.rows[items].doc._id)
                body.rows[items].doc.classes = getClasses(schools, body.rows[items].doc._id);
            }
            //Return Result
            res.json(body.rows);
        });

    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    console.log('teacher get: '.green + id);
    db.get(id, function (err, body) {
        if (err) {
            console.log("not found")
            return res.status(204).json({
                'result': 'nok',
                'message': err
            });
        }
        //Remove Sensitive Information
        delete body._rev;
        delete body.password;
        delete body.pin;


        //gets schools ans classes
        db2.list({
            'include_docs': true,
            'attachments': true,
            'limit': undefined,
            'descending': false
        }, function (err, schools) {
            if (err) {
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            }
            console.log(body.classes)
            body.classes = getClasses(schools, id);
            //Return Result
            res.json(body);
        });

    });
};

//Returns an array of all classes teached by some professor
function getClasses(schools, idProf) {
    console.log("getting classes".green)
    var profClasses = [];

    //Search all schools
    for (var school = 0; school < schools.rows.length; school++) {
        var escola = schools.rows[school].doc;
        var classes = {};
        if (JSON.stringify(escola).indexOf(idProf) != -1) {
            classes["id"] = escola._id;
            classes["name"] = escola.name;
            classes["class"] = [];
            //Search all classes
            for (var turma in escola.classes) {

                //If professor belongs to that class
                if (JSON.stringify(escola.classes[turma]).indexOf(idProf) != -1) {
                    classes["class"].push({
                        id: escola.classes[turma]._id,
                        name: escola.classes[turma].year + "º " + escola.classes[turma].name
                    })
                }
            }
            profClasses.push(classes)
        }
    }
    return profClasses;
}

//Função para associar professores às turmas
function insertProfTurma(idProf, escola, turmas) {
    var existe = false;
    if (idProf && escola && turmas) {
        //Obtem os dados da escola
        db2.get(escola, function (err, schoolData) {
            if (err) {
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            }
            else {
                //Verifica as turmas registadas.
                for (var turma in schoolData.classes) {
                    //Quando encontrar uma turma para ser associada
                    if (turmas.indexOf(schoolData.classes[turma]._id) != -1) {
                        //Verifica se já está associada ao professor
                        for (var prof in schoolData.classes[turma].profs) {
                            //Se não estiver associado, associa
                            if (schoolData.classes[turma].profs[prof]._id === idProf) {
                                existe = true;
                            }
                        }
                        if (!existe) {
                            schoolData.classes[turma].profs.push(
                                {"_id": idProf}
                            );
                        } else {
                            console.log(idProf + ", já está associado à turma " + schoolData.classes[turma].year + "º " + schoolData.classes[turma].name);
                        }
                        existe = false;
                    } else {
                        console.log(schoolData.classes[turma].profs);
                    }
                }
                db2.insert(schoolData, schoolData._id);
            }

        });
    }

};

function removeProfTurma(id, school, classe, res) {
    console.log(id, school, classe)
    db2.get(school, function (err, schoolData) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //Verifica as turmas registadas.
        for (var turma = 0; turma < schoolData.classes.length; turma++) {
            //Quando encontrar uma turma para ser desassociada
            if (schoolData.classes[turma]._id == classe) {
                //Verifica se já está associada ao professor
                for (var prof = 0; prof < schoolData.classes[turma].profs.length; prof++) {
                    //Se estiver associado, desassocia
                    if (schoolData.classes[turma].profs[prof]._id === id) {
                        schoolData.classes[turma].profs.splice(prof, 1);
                        console.log('Class Removed Successfully'.green + classe);
                        db2.insert(schoolData, schoolData._id);
                        res.status(200).json({});
                    }
                }
            }
        }


    });
}

function sortJsonByCol(property) {

    'use strict';
    return function (a, b) {
        var sortStatus = 0;
        if (a[property] < b[property]) {
            sortStatus = -1;
        } else if (a[property] > b[property]) {
            sortStatus = 1;
        }
        return sortStatus;
    };

};
//Função para desassociar professores às turmas
exports.rmvClass = function (req, res) {
    //Obtem os dados da escola
    console.log(req.body)
    removeProfTurma(req.body.id, req.body.school, req.body.class, res);
};