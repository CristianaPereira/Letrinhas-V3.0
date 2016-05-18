require('colors');

var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('let_tests');
var dbp = nano.use('let_questions');

exports.upDate = function (req, res) {

};

exports.new = function (req, res) {
    console.log(req.body)

    //Verify Fields
    if (JSON.stringify(req.body).indexOf('""') == -1) {
        var dati = new Date();
        //Creates a tes obj
        var test = {
            "_id": 'T' + dati.getTime(),
            "title": req.body.title,
            "description": req.body.title,
            "subject": req.body.subject + ":" + req.body.content + ":" + req.body.specification,
            "schoolYear": parseInt(req.body.schoolYear),
            "questions": req.body.questions,
            "description": req.body.description,
            "profID": req.params.userID
        };

        db.insert(test, (req.body.title).replace(/\s+/g, '') + new Date().getTime(), function (err) {
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
        res.json(body.rows);
    });

};

