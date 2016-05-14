require('colors');

var nano = require('nano')(process.env.COUCHDB);
var dbQuest = nano.use('dev_perguntas');

var fs = require('fs-extra'),       //File System - for file manipulation
    mime = require('mime');

//Como as perguntas nuca se poderão alterar
//usa-se o upDate apenas para desabilitar a pergunta
exports.upDate = function (req, res) {

    //If there's any empty field, stops right here
    if (JSON.stringify(req.body).indexOf('""') != -1) {
        console.log('Required Arguments Missing'.green);
        return res.status(406).json({
            'result': 'Campos em falta'
        });
    } else {
        dbQuest.get(req.params.id, function (err, body) {
            if (err) {
                console.log("Não foi possivel aceder a " + req.params['id'] + '\n'
                    + "erro: " + err);
                return res.status(err.statusCode).json({});
            }
            console.log(body)
            //If the teacher trying to edit isn't the author of the question, stops right here
            if (req.params.userID != body.profID) {
                console.log("You shall not pass!You have no permissions.".red);
                return res.status(403).json({
                    'result': 'Apenas o criador da pergunta (' + body.profID + ') tem permissões para a alterar.'
                });

            } else {
                body.title = req.body.title;
                body.subject = req.body.subject + ":" + req.body.content + ":" + req.body.specification;
                body.schoolYear = req.body.schoolYear;
                body.question = req.body.question;
                body.description = req.body.description;
                body.content = {};
                body.state = Boolean(req.body.state);


                switch (body.type) {
                    case "text":
                        body.content["text"] = req.body.text;
                        break;

                    case "list":
                        body.content["column"] = JSON.parse(req.body.column);
                        break;

                    case "interpretation":
                        //Content Text
                        body.content["text"] = req.body.text;

                        //Iterate SID's
                        body.content["sid"] = [];
                        var $sid = req.body.sid.split(',');
                        for (var i in $sid) {
                            body.content.sid.push($sid[i]);
                        }

                        break;
                    case "multimedia":
                        console.log(JSON.parse(req.body.answers));
                        body.content["questionType"] = req.body.questionType;
                        body.content["answerType"] = req.body.answerType;
                        //Se a pegunta nao for do tipo audio (imagem ou texto
                        if (req.body.questionType != "audio") {
                            body.content["question"] = req.body.contentQuest;
                        }
                        body.content["answers"] = JSON.parse(req.body.answers);
                        break;
                    default:
                        break;
                }

                //Check if ther's a file and if its a MP3 File
                if ((req.body.filePath) && (mime.lookup(req.body.filePath)).startsWith("audio")) {
                    //Image Data Sync
                    var $imgData = fs.readFileSync(req.body.filePath);
                    //Inserts new document with attachment
                    dbQuest.multipart.insert(body, [{
                        name: 'voice.mp3',
                        data: $imgData,
                        content_type: 'audio/mp3'
                    }], body._id, function (err, body) {
                        if (err) {
                            console.log('questions new, an error ocourred'.green);
                            res.send(500);
                        }
                        else {
                            console.log('New Test Added'.red);
                        }
                    });
                    //Inserts new document without attachment
                } else {
                    dbQuest.insert(body, body._id, function (err, body) {
                        if (err) {
                            console.log('questions edit, an error ocourred'.yellow);
                            res.send(500);
                        }
                        else {
                            console.log('Questions successful edited'.red);
                        }
                    });
                }
                console.log("Edited Question");
                res.send(200);
            }

        });
    }
};

exports.getAll = function (req, res) {
    console.log('all questions'.green);

    dbQuest.list({'include_docs': true, 'limit': undefined, 'descending': true}, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }

        res.json(body.rows);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    console.log('one question get'.green);

    dbQuest.get(id, function (err, body) {
        if (err) {
            console.log('ERRO!:'.red);
            console.log(err);
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }

        res.json(body);
    });
};

exports.test = function (req, res) {

    //If there's any empty field, stops right here

    if (JSON.stringify(req.body).indexOf('""') != -1) {

        console.log('Required Arguments Missing'.green);
        return res.status(406).json({
            'result': 'Campos em falta'
        });
    } else {
        //Date And ID's Generator
        var $date = new Date();
        var $idQuest = 'Q' + $date.getTime();


        console.log(req.body)
        console.log("----------------")
        //Test Question
        var $question = {
            "title": req.body.title,
            "subject": req.body.subject + ":" + req.body.content + ":" + req.body.specification,
            "schoolYear": req.body.schoolYear,
            "question": req.body.question,
            "description": req.body.description,
            "content": {},
            "state": Boolean(req.body.state),
            "type": req.body.type,
            "profID": req.params.userID,
            "creationDate": $date
        };
        console.log($question)
        //Select Question Type
        switch ($question.type) {
            case "text":
                $question.content["text"] = req.body.text;
                break;

            case "list":
                $question.content["column"] = JSON.parse(req.body.column);
                break;

            case "interpretation":
                //Content Text
                $question.content["text"] = req.body.text;

                //Iterate SID's
                $question.content["sid"] = [];
                var $sid = req.body.sid.split(',');
                for (var i in $sid) {
                    $question.content.sid.push($sid[i]);
                }

                break;
            case "multimedia":
                console.log(JSON.parse(req.body.answers));
                $question.content["questionType"] = req.body.questionType;
                $question.content["answerType"] = req.body.answerType;
                //Se a pegunta nao for do tipo audio (imagem ou texto
                if (req.body.questionType != "audio") {
                    $question.content["question"] = req.body.contentQuest;
                }
                $question.content["answers"] = JSON.parse(req.body.answers);
                break;
            default:
                break;
        }

        //Check if ther's a file and if its a MP3 File
        if ((req.body.filePath) && (mime.lookup(req.body.filePath)).startsWith("audio")) {
            //Image Data Sync
            var $imgData = fs.readFileSync(req.body.filePath);
            //Inserts new document with attachment
            dbQuest.multipart.insert($question, [{
                name: 'voice.mp3',
                data: $imgData,
                content_type: 'audio/mp3'
            }], $idQuest, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);
                    res.send(500);
                }
                else {
                    console.log('New Test Added'.red);
                }
            });
            //Inserts new document without attachment
        } else {
            dbQuest.insert($question, $idQuest, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.yellow);
                    res.send(500);
                }
                else {
                    console.log('New Test Added'.red);
                }

            });
        }
        console.log("New Question");
        res.send(200);
    }

};


function wordPrefix($col) {
    var $col = ($col)
        .replace(/(\r\n|\n|\r)/gm, " ")  //Replaces all 3 types of line breaks with a space
        .replace(/\s+/g, " ")            //Replace all double white spaces with single spaces
        .split(" ");                   //Split String Into Array

    var $json = [];

    for (var i in $col) {
        $json.push($col[i]);
    }

    return $json;
}