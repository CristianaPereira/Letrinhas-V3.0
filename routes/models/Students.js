require('colors');

//DB Info
var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('let_students');

var jsonQuery = require('json-query');

var Student = function (data) {
    this.data = data;
}

Student.prototype.data = {}

Student.prototype.get = function (name) {
    return this.data[name];
};

Student.prototype.set = function (name, value) {
    if (value) {
        this.data[name] = value;
    }
};

Student.getAll = function (callback) {
    db.list({'include_docs': true, 'attachments': true, 'limit': undefined, 'descending': false},
        function (err, body) {
            //if an error occurs
            if (err) return callback(err);
            //else sends fetched data
            callback(null, new Student(body.rows));
        });
};

Student.getByClass = function (idClass, callback) {
    db.list({'include_docs': true, 'attachments': true, 'limit': undefined, 'descending': false},
        function (err, body) {
            //if an error occurs
            if (err) return callback(err);
            //else sends fetched data
            //Obtem os alunos da turma escolhida
            var students = jsonQuery('rows[doc][*class=' + idClass + ']', {data: body}).value;
            for (var i = 0; i < students.length; i++) {
                //Remove os campos desnecessarios
                delete students[i]._rev;
                delete students[i].school;
                delete students[i].class;
                delete students[i].password;
            }
            callback(null, new Student(students));
        });
};

module.exports = Student;