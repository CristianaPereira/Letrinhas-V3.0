require('colors');

var nano = require('nano')(process.env.COUCHDB);

var db = nano.use('dev_alunos');
var dbe = nano.use('dev_escolas');

exports.new = function (req, res) {

    //Verify Fields
    if (req.body.name && req.body.number && req.body.class && req.body.b64) {

        //!TEMPORARY! - Separating Class From School
        var sclass = (req.body.class).split(":");

        var newStudent = {
            "nome": req.body.name,
            "estado": true,
            "numero": req.body.number,
            "escola": sclass[0],
            "turma": sclass[1],
            "b64": req.body.b64,
        };

        db.insert(newStudent, (req.body.name).replace(/\s+/g, '') + new Date().getTime(), function (err) {
            if (err)
                return res.status(err.statusCode).json({});
            else {
                console.log('New student was inserted'.green);
                res.status(200).json({});
            }
        })
    }
    else {
        console.log("Fields Missing");
        res.send(401, {error: "Todos os campos sao de preenchimento obrigatório"});
    }

};

exports.getAll = function (req, res) {

    console.log('students getAll'.green);

    db.list({'include_docs': true, 'attachments': true, 'limit': undefined, 'descending': true}, function (err, body) {
        if (err) {
            res.send(err.statusCode, {error: "Erro a procurar alunos"});
        }

        res.json(body.rows);
    });
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

//NEW
exports.editStudent = function (req, res) {

    if (req.body.name != '' && req.body.number != '') {

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

                body.nome = req.body.name;
                body.numero = req.body.number;

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
                        res.send(200);
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

exports.getStudents = function (req, res) {

    var user = req.params.id;

    var escolas = [];

    //Get Teacher Classes
    dbe.list({
        'include_docs': true,
        'attachments': false,
        'limit': undefined,
        'descending': true
    }, function (err, body) {
        if (err) {
            return res.status(err.statusCode, {error: "Erro a procurar alunos"});
        }

        //Fetch Classes
        var classes = "";

        for (var i in body.rows) {

            for (var j in body.rows[i].doc.turmas) {

                for (var k in body.rows[i].doc.turmas[j].professores) {

                    if (body.rows[i].doc.turmas[j].professores[k]._id == user)
                        classes += body.rows[i].doc.turmas[j]._id + " ";
                    escolas.push({
                        "_id": body.rows[i].doc.turmas[j]._id,
                        "details": body.rows[i].doc.nome + ", " + body.rows[i].doc.turmas[j].ano + "º " + body.rows[i].doc.turmas[j].nome
                    })
                    //classes.push({"_id": body.rows[i].doc.turmas[j]._id});

                }

            }

        }

        console.log(classes);

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
            var students = body2;

            //Filtra "os meus alunos"
            for (var i = 0; i < students.rows.length; i++) {

                var search = new RegExp(students.rows[i].doc.turma);
                if (!search.test(classes))
                    students.rows.splice(i, 1);
            }
            //Adiciona a string da escola
            for (var i = 0; i < students.rows.length; i++) {
                //Adiciona o campo com o nome da escola e aturma por extenso
                for (var esc in escolas) {
                    if (escolas[esc]._id == students.rows[i].doc.turma) {
                        students.rows[i].doc.schoolDetails = escolas[esc].details;
                    }
                }
            }

            res.json(students.rows);
            console.log("fim2");
        });

    });

};

exports.removeStudent = function (req, res) {

    //Fetch School
    console.log('Remove Student: Fetching Student ' + req.params.id + ''.green);

    //Search School Info
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
                    console.log("Student Removed");
                    return res.status(200).json({});
                }

            });

        }

    });


};

function getEscola(turma) {
    var escola = '';

    for (i = 0; i < turma.length; i++) {
        //procuro o separador ':' --> id_escola:id_Turma;
        if (turma.charCodeAt(i) != 58) {
            //adiciona o caracter ao ID
            escola += turma.charAt(i);
        }
        //devole o id da escola
        else return escola;
    }

    return null;
};

function getTurma(turma) {
    var tturma = '';
    var isIdTurma = false;

    for (i = 0; i < turma.length; i++) {
        //procuro o separador ':' --> id_escola:id_Turma;
        if (turma.charCodeAt(i) != 58) {
            if (isIdTurma) {
                //se estou a ler o id da turma
                //entã espero encontrar o separador ';'
                //para identificar o fim da leitura
                if (turma.charCodeAt(i) == 59) {
                    return tturma;
                }
                else {
                    tturma += turma.charAt(i);
                }
            }
        }
        else {
            //encontrei o separador da ":" começo a ler o id da turma
            isIdTurma = true;
        }
    }

    return null;
};
