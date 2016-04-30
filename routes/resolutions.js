require('colors');

var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('dev_resolucoes');

exports.new = function (req, res) {


};


exports.get = function (req, res) {

};

//Revamp
exports.getAll = function (req, res) {

    var user = req.params.id;
    console.log('Fetching All resolutios'.green);
    db.list({'include_docs': true, 'limit': undefined, 'descending': true}, function (err, body) {
        if (err) {
            return res.status(500).json({
                'result': 'nok',
                'message': err
            });
        }
        var output = [];

        console.log(body.rows.length);
        for (var resol = 0; resol < body.rows.length; resol++) {
            //Se o teste ainda não estiver corrigido ou se não for do prof em questao

            // if (user != body.rows[resol].doc.id_Prof || body.rows[resol].doc.nota != -1) {
            if (user != body.rows[resol].doc.id_Prof) {
                console.log(user + " " + body.rows[resol].doc.id_Prof);
            } else {
                console.log(user + " " + body.rows[resol].doc.id_Prof.green);
                output.push(body.rows[resol]);
            }
        }
        res.json(output);
    });
};