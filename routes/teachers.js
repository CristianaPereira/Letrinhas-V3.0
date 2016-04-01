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
    //Verify Fields
    console.log(req.body);
    if (req.body.name && req.body.password && req.body.codPin && req.body.telefone && req.body.imgb64 && req.body.tipo) {
        var state = false;

        if (req.body.estado == "Ativo") {
            state = true;
        }
        var newteacher = {
            "estado": state,
            "nome": req.body.name,
            "password": req.body.password,
            "pin": req.body.codPin,
            "telefone": req.body.telefone,
            "tipoFuncionario": req.body.tipo,
            "permissionLevel": req.body.tipo,
            "imgb64": req.body.imgb64,
        };

        db.insert(newteacher, req.body.email, function (err, body) {
            if (err)
                console.log("(L-131) - Não foi possivel inserir " + req.body.email + '\n' + "erro: " + err);
            else {
                res.json(body);
                console.log('New teacher ' + req.body.nome + ' was inserted!'.green);

            }
        });

        var escolas = JSON.parse(req.body.turmas);

        for (var items in escolas) {
            console.log("Ver escola :" + escolas[items].id);
            insertProfTurma(req.body.email, escolas[items].id, escolas[items].turma);
            console.log("-------------");
        }

        res.redirect('/teachers');
    } else {
        return res.status(500).json({
            'result': 'Campos em falta'
        });
    }


};

exports.updateDetails = function (req, res) {
    console.log('Teachers - UPDATE'.cyan);


    db.get(req.body.email, function (err, body) {
        if (err) {
            console.log("(L-20) - Não foi possivel aceder a " + req.body.email + '\n'
                + "erro: " + err);
            res.redirect('/teachers');
        }
        body.estado = req.body.estado;
        body.nome = req.body.name;
        body.telefone = req.body.telefone;
        body.tipoFuncionario = req.body.tipo;
        if (req.body.imgb64) {
            body.imgb64 = req.body.imgb64;
        }
        db.insert(body, req.body.email, function (err, body) {
            if (err)
                console.log("(L-131) - Não foi possivel alterar " + req.body.email + '\n' + "erro: " + err);
            else {
                res.json(body);
                console.log('New teacher ' + req.body.name + ' was inserted!'.green);

            }
        });
    });
};

exports.editPasswd = function (req, res) {
    console.log('Teachers - UPDATE'.cyan);
    console.log(req.body);
    //começo do upDate...
    db.get(req.body.email, function (err, body) {
        if (err) {
            console.log("(L-20) - Não foi possivel aceder a " + req.body.email + '\n'
                + "erro: " + err);
            res.redirect('/teachers');
        }
        //Se a palavara passe antiga estver correcta
        if (body.password == req.body.oldPswd) {
            body.password = req.body.newPswd;
            db.insert(body, req.body.email, function (err, body) {
                if (err)
                    console.log("(L-131) - Não foi possivel alterar a passord de: " + req.body.email + '\n' + "erro: " + err);
                else {
                    res.json(body);
                    console.log('Password alterada'.green + ':' + req.body.email);
                }
            });
        } else {
            console.log("Não foi possivel alterar a password.\n" + "erro: " + err);
        }

    });
};

exports.editClasses = function (req, res) {
    var escolas = JSON.parse(req.body.turmas);
    for (var items in escolas) {
        insertProfTurma(req.body.email, escolas[items].id, escolas[items].turmas);
    }
    res.redirect('/teachers/' + req.body.email);
};

exports.delete = function (req, res) {

    db.get(req.params.id, function (err, body) {
        if (err) {
            console.log("Nao foi possivel encontrar " + req.params.id + "\n " + err);

            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        } else {
            db.destroy(req.params.id, body._rev, function (err, body) {
                if (!err) {
                    console.log('teachers deleted'.green + req.params.id);
                    res.json(body);
                } else {
                    console.log("Não foi possivel apagar" + err);
                }

            });
        }
    });

    res.redirect('/teachers');
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
        for (var items in body.rows) {
            delete body.rows[items].value;
            delete body.rows[items].doc._rev;
            delete body.rows[items].doc.password;
            delete body.rows[items].doc.pin;
        }

        res.json(body.rows);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    console.log('teacher get: '.green + id);
    db.get(id, function (err, body) {
        if (err) {
            return res.status(204).json({
                'result': 'nok',
                'message': err
            });
        }
        //Remove Sensitive Information
        delete body._rev;
        delete body.password;
        delete body.pin;
        //Return Result
        res.json(body);
    });
};


//Função para atualizar as turmas com o id do professor
function insertProfTurma(idProf, escola, turmas) {

    var existe = false;
    //Obtem os dados da escola
    db2.get(escola, function (err, schoolData) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //Verifica as turmas registadas.
        for (var turma in schoolData.turmas) {
            //Quando encontrar uma turma para ser associada
            if (turmas.indexOf(schoolData.turmas[turma]._id) > -1) {
                //Verifica se já está associada ao professor
                for (var prof in schoolData.turmas[turma].professores) {
                    //Se não estiver associado, associa
                    if (schoolData.turmas[turma].professores[prof].id === idProf) {
                        existe = true;
                    }
                }
                if (!existe) {
                    schoolData.turmas[turma].professores.push(
                        {"_id": idProf}
                    );
                } else {
                    console.log(idProf + ", já está associado à turma " + schoolData.turmas[turma].ano + "º " + schoolData.turmas[turma].nome);
                }
            } else {
                console.log(schoolData.turmas[turma].professores);
            }
        }
        db2.insert(schoolData, schoolData._id);
    });
};

