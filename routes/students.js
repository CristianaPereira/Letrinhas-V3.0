require('colors');

var nano = require('nano')(process.env.COUCHDB);

var db = nano.use('let_students');
var dbe = nano.use('let_schools');

exports.new = function (req, res) {

    console.log(req.body)
    //Verify Fields
    if (JSON.stringify(req.body).indexOf('""') == -1) {
        //verifica se o username nao esta a ser utilizado
        exists(req.body.username, function (exists) {
            if (!exists) {
                //!TEMPORARY! - Separating Class From School
                var newStudent = {
                    "school": req.body.school,
                    "name": req.body.name,
                    "b64": req.body.b64,
                    "number": req.body.number,
                    "password": req.body.password,
                    "username": req.body.username,
                    "class": req.body.class
                };

                db.insert(newStudent, (req.body.name).replace(/\s+/g, '') + new Date().getTime(), function (err) {
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

//NEW
exports.editStudent = function (req, res) {

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
            return res.status(err.statusCode, {error: "Erro a procurar alunos"});
        }

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
        console.log(escolas);
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

            res.json(myStudents);
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

function exists(username, callback) {
    //Fetch Students From Classes
    db.list({
        'include_docs': true,
        'attachments': false,
        'limit': undefined,
        'descending': true
    }, function (err, data) {
        if (err) {
            return res.status(err.statusCode).json({});
        }
        var students = data.rows;
        console.log(username)
        for (var i = 0; i < students.length; i++) {
            console.log(students[i].doc.username)

            if (students[i].doc.username == username) {
                callback(true);
            }
        }
        callback(false);
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
