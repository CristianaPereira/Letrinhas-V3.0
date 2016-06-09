require('colors');

//DB Info
var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('let_categories');

//Get category by ID
exports.get = function (req, res) {

    var id = req.params.id;
    console.log('category get: '.green + id);

    //Search School Parameters
    db.get(id, function (err, body) {
        if (err) {
            return res.status(err.statusCode).json({});
        }

        //delete body._id;
        delete body._rev;
        res.status(200).json(body);
    });
};

exports.new = function (req, res) {

    //Check For Required Fields
    if (req.body.name && req.body.address && req.body.b64) {

        var category = {
            "subject": req.body.subject,
            "morada": req.body.address,
            "turmas": [],
            "b64": req.body.b64
        }
        var id = "NEW|Escola" + new Date().getTime();
        db.insert(school, id, function (err) {
            if (err)
                return res.status(500).json({
                    'result': 'nok',
                    'message': err
                });
            else {
                console.log('New school was inserted'.green);

                res.status(200).json([id]);
            }
        })

    }
    else {
        console.log('Required Arguments Missing'.green);
        res.status(406).json({});
    }


};
exports.addSpecif = function (req, res) {
    console.log(req.body)
    console.log('Adding specification: '.green + req.body.id);
    var newId = new Date().getTime() * 0.3;
    var inserido = false;
    //Search School Parameters
    db.get(req.body.id, function (err, data) {
            if (err) {
                console.log("Especificação não inserida");
                return res.status(400).json({});
            } else {
                //percorre a categoria ate encontrar o conteudo desejado e adiciona a nova especificacao
                for (var i = 0; i < data.content.length; i++) {
                    console.log(i)
                    if (data.content[i]._id == req.body.content) {
                        data.content[i].specification.push({_id: newId, name: req.body.specification});
                        //insere na bd
                        db.insert(data, req.body.id, function (err) {
                            if (err) {
                                console.log("Especificação não inserida");
                                return res.send(200, {text: "Especificação não inserida."});
                            }
                        })
                    }
                }
                console.log("Especificação inserida");
                return res.send(200, {text: "Especificação inserida."});
            }
        }
    );
};
exports.getAll = function (req, res) {
    console.log('category getAll'.yellow);

    db.list({'include_docs': true, 'attachments': true, 'limit': undefined, 'descending': false}, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        res.json(body.rows);
    });
};

