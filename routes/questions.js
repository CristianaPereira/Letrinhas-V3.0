require('colors');

var nano = require('nano')(process.env.COUCHDB);
var db2 = nano.use('dev_perguntas');

var fs = require('fs-extra'),       //File System - for file manipulation
    mime = require('mime');

//Como as perguntas nuca se poderão alterar
//usa-se o upDate apenas para desabilitar a pergunta
exports.upDate = function (rep, res) {
    console.log('questions upDate,'.blue);
    console.log(rep.params['id']);
    var estado = false;

    db.get(rep.params['id'], function (err, body) {
        if (err) {
            console.log("Não foi possivel aceder a " + rep.params['id'] + '\n'
                + "erro: " + err);
        }

        db.update = function (obj, key, callback) {
            db.get(key, function (error, existing) {
                if (!error) obj._rev = existing._rev;
                db.insert(obj, key, callback);
            });
        };

        body.estado = estado;
        console.log(body);

        db.update(body, body._id, function (err1, res) {
            if (err1) return console.log(rep.params['id'] + " wasn't update!".red + '\n' + err1);
            console.log("The data of " + rep.params['id'] + ' was Updated!'.green);
        });
        switch (rep.body.tipo) {
            case 'Texto':
                //res.redirect('/#tests');
                break;
            case 'Lista':
                //res.redirect('/#tests');
                break;
            case 'Multimédia':
                res.redirect('/#questionsMultimedia/new');
                break;
            case 'Interpretacao':
                //res.redirect('/#tests');
                break;
            default:
                res.redirect('/#tests');
        }
    });
};

exports.getAll = function (req, res) {
    console.log('all questions'.green);

    db2.list({'include_docs': true, 'limit': undefined, 'descending': true}, function (err, body) {
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

    db.get(id, function (err, body) {
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

    console.log("Inserting new Question");
    // console.log(req.body);
    //console.log(req.body.content);


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
        "profID": req.params.id,
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
        db2.multipart.insert($question, [{
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
        db2.insert($question, $idQuest, function (err, body) {
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


    console.log("-----------------------------");
    console.log($question);
    console.log("-----------------------------");
    res.send(200);

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