require('colors');

var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('let_tests');
var jsonQuery = require('json-query');

exports.upDate = function (req, res) {

};

exports.newGeneric = function (req, res) {
    console.log(req.body)

    //Verify Fields
    if (JSON.stringify(req.body).indexOf('""') == -1) {
        var dati = new Date();
        var id = 'T' + dati.getTime();
        //Creates a tes obj
        var test = {
            "title": req.body.title,
            "generic": true,
            "subject": [req.body.subject, req.body.content, req.body.specification].join(':'),
            "schoolYear": parseInt(req.body.schoolYear),
            "questions": req.body.questions,
            "profID": req.params.userID
        };

        db.insert(test, function (err) {
            if (err)
                return res.status(err.statusCode).json({});
            else {
                console.log('New test was inserted'.green);
                res.status(200).json({});
            }
        })
    }
    else {
        console.log("Fields Missing");
        res.send(401, {result: "Todos os campos sao de preenchimento obrigatório"});
    }
};
exports.new = function (req, res) {
    console.log(req.body)
    var user = req.params.userID;
    //Verify Fields
    if (JSON.stringify(req.body).indexOf('""') == -1) {

        //Creates a tes obj
        var test = req.body;
        test.profID = user;
        test.note = -1;
        test.solved = false;
        test.generic = false;
        //Separa o d-m-a, inverte-o para a-m-d e transforma-o em timestamp
        test.beginDate = new Date(test.beginDate.split("-").reverse().join("-")).getTime();
        test.endDate = new Date(test.endDate.split("-").reverse().join("-")).getTime();
        db.insert(test, function (err) {
            if (err)
                return res.status(err.statusCode).json({});
            else {
                console.log('New test was associated'.green);
                res.send(200, {result: "Teste associado com sucesso!"});
            }
        })
    }
    else {
        console.log("Fields Missing");
        res.send(401, {result: "Todos os campos sao de preenchimento obrigatório"});
    }

};

exports.get = function (req, res) {


};

exports.getAll = function (req, res) {

    console.log('Getting all tests'.blueBG + ' : ' + req.params.userID.blue);

    db.list({
        'include_docs': true, 'attachments': true,
        'limit': undefined, 'descending': false
    }, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        console.log(body.rows)
        res.json(jsonQuery('[doc][*generic=true]', {data: body.rows}).value);
    });

};

