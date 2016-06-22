require('colors');


var nano = require('nano')(process.env.COUCHDB);
var dbResolutions = nano.use('let_resolutions');
var dbStudents = nano.use('let_students');
var dbTests = nano.use('let_tests');
var dbQuestions = nano.use('let_questions');
var jsonQuery = require('json-query');

exports.new = function (req, res) {
    console.log(req.body)
    //Guarda as infos das questions
    var questionsInfo = req.body.questions;
    var testInfo = req.body.test;

    //obtem as resolucoes
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

        //Por cada pergunta
        for (var f = 0; f < questionsInfo.length; f++) {
            //Search resol info
            var quest = questionsInfo[f];
            console.log("--------------------------------------------------------------")
            //Obtem a resolucao
            var questResol = jsonQuery('rows[doc][_id=' + quest.resolID + ']', {data: resolutions}).value;

            questResol.note = parseFloat(quest.note).toFixed(2);
            if (quest.text) {
                questResol.text = quest.text;
            }
            if (quest.time) {
                questResol.time = quest.time;
            }
            if (quest.inflection) {
                questResol.inflection = quest.inflection;
            }
            if (quest.ponctuation) {
                questResol.ponctuation = quest.ponctuation;
            }
            if (quest.errors) {
                questResol.errors = quest.errors;
            }
            console.log(questResol)
            //guarda na bd os dados da correcao
            dbResolutions.insert(questResol, questResol._id, function (err) {
                if (err)
                    return res.status(err.statusCode).json({});
                else {
                    console.log('Resposta corrigida'.green);
                }
            });
        }
        //Obtem os dados do teste e guarda a nota
        dbTests.get(testInfo.testID, function (err, test) {
            if (err) {
                return res.status(err.statusCode).json({});
            }

            test.note = parseFloat(testInfo.testNote).toFixed(2);
            console.log(test)

            //guarda na bd os dados da correcao
            dbTests.insert(test, testInfo.testID, function (err) {
                if (err)
                    return res.status(err.statusCode).json({});
                else {
                    res.send(200, {text: "Teste corrigido com sucesso!"});
                }
            });
        });


    });


};
exports.get = function (req, res) {
    var id = req.params.id;
    console.log('student get: '.green + id);
    //Obtem os dados do teste
    dbTests.get(id, function (err, resolution) {
        if (err) {
            return res.status(err.statusCode).json({});
        }

        //Obtem os dados do aluno
        console.log('student get: '.green + resolution.studentID);
        dbStudents.get(resolution.studentID, function (err, student) {
            if (err) {
                return res.status(err.statusCode).json({});
            }
            resolution.student = student;
            //Obtem os dados das questions do teste
            dbQuestions.list({'include_docs': true, 'limit': undefined, 'descending': true}, function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }

                //Obtem os dados das resolucoes das questions
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
                    //Obtem as resolucoes das perguntas
                    var testResolutions = jsonQuery('rows[doc][*testID=' + id + ']', {data: resolutions}).value;
                    console.log("testResolutions");
                    console.log(testResolutions);
                    //Adiciona os dados ao json
                    for (var q = 0; q < resolution.questions.length; q++) {
                        resolution.questions[q].info = (jsonQuery('rows[doc][_id=' + resolution.questions[q]._id + ']', {data: questions}).value)
                        resolution.questions[q].resol = (jsonQuery('[questionID=' + resolution.questions[q]._id + ']', {data: testResolutions}).value)
                    }


                    res.json(resolution);
                });
            });
        });
    });
};

//Revamp
exports.getAll = function (req, res) {

    var user = req.params.userID;
    console.log('Fetching All resolutios'.green);
    dbTests.list({'include_docs': true, 'limit': undefined, 'descending': true}, function (err, solvedTests) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        //Filtra as resolucoes por apenas as que pertencem ao professor e nao estao corrigidas
        var output = jsonQuery('rows[doc][*profID=' + user + ' & note=-1 & solved=true]', {data: solvedTests}).value
        //console.log(output)
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

