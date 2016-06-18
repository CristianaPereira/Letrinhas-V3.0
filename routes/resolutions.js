require('colors');


var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('let_resolutions');
var dbStudents = nano.use('let_students');
var dbQuestions = nano.use('let_questions');
var jsonQuery = require('json-query');

exports.replace = function (req, res) {


};


exports.get = function (req, res) {
    var id = req.params.id;
    console.log('student get: '.green + id);

    db.get(id, function (err, resolution) {
        if (err) {
            return res.status(err.statusCode).json({});
        }

        //Obtem os dados do aluno
        console.log(resolution.studentID)
        console.log('student get: '.green + resolution.studentID);
        dbStudents.get(resolution.studentID, function (err, student) {
            if (err) {
                return res.status(err.statusCode).json({});
            }
            resolution.student = student;
            dbQuestions.get(resolution.questionID, function (err, question) {
                if (err) {
                    return res.status(err.statusCode).json({});
                }
                resolution.question = question;
                res.json(resolution);
            });
        });

    });
};

//Revamp
exports.getAll = function (req, res) {

    var user = req.params.userID;
    console.log('Fetching All resolutios'.green);
    db.list({'include_docs': true, 'limit': undefined, 'descending': true}, function (err, resolutions) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //Filtra as resolucoes por apenas as que pertencem ao professor e nao estao corrigidas
        var output = jsonQuery('rows[doc][*profID=' + user + ' & note=-1]', {data: resolutions}).value
        console.log(output)
        //Adiciona as resolucoes a foto do aluno em questao
        getStudentsData(output, function () {
            res.json(output);
        });
    });
};

function getStudentsData(output, callback) {
    dbStudents.list({
        'include_docs': true,
        'attachments': false,
        'limit': undefined,
        'descending': true
    }, function (err, students) {
        if (err) {
            return "";
        }
        //Por cada resolucao adiciona a foto do aluno correspondente
        for (var out = 0; out < output.length; out++) {
            //Obtem o campo b64
            var student = jsonQuery('rows[id=' + output[out].studentID + '].doc', {data: students}).value;
            // console.log(student)
            output[out].studentFoto = student.b64;
            output[out].studentName = student.name;
        }
        callback();
    });
}

