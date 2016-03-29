require('colors');

//Database
var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('dev_professores');

//Requirements
var express = require('express'),
    bodyParser = require('body-parser'),
    basicAuth = require('basic-auth'),
    http = require('http');

//Path Variable
var path = require('path');

//Route Controllers
var schools = require('./routes/schools'),
    teachers = require('./routes/teachers'),
    students = require('./routes/students'),
    tests = require('./routes/tests'),
    questions = require('./routes/questions'),
    submissions = require('./routes/submissions');

var app = express();

// configure app to use bodyParser()
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));


//Set our server port
app.set('port', process.env.PORT || 8081);


// get an instance of router
var router = express.Router();

// Route middleware that will happen on every request
router.use(function (req, res, next) {
    // log each request to the console
    console.log("Route Request: ".blue + req.method + " " + req.url);
    next();
});

// Validating Login
var auth = function (req, res, next) {
    //Check For Login User
    var login = basicAuth(req);
    if (login) {
        db.get(login.name, {revs_info: true}, function (err, body) {
            if (!err) {
                if (body.password == login.pass) {
                    console.log("Login Successfully");
                    req.user = {name: login.name, perm: body.permissionLevel};
                    next();
                }
                else {
                    //Report Error
                    console.log("Login Attempt Failed - Wrong info");
                    res.status(401).json({});
                }
            }
            else {
                //Report Error
                console.log("Login Attempt Failed" + err);
                res.status(401).json({
                    'result': 'nok',
                    'message': err
                });
            }

        });
    }
    else {
        //Report Error
        console.log("Login Attempt Failed - Missing user");
        res.status(401).json({'result': 'Acesso negado. Por favor efectue login.'});
    }

}

/**
 * PERMISSIONS:
 * 1 -> Auxiliar
 * 2 -> Professor
 * 3 -> Administrador de Sistema
 *
 * @param level
 * @returns {Function}
 */
// Validating Permissions
var perms = function (level) {
    return function (req, res, next) {
        if (req.user.perm >= level) {
            next();
        }
        else {
            console.log("Permission Error");
            res.status(401).json(["Permission Error"]);
        }
    }
}

// Make Teacher Query Be On Logged User
var tself = function (req, res, next) {
    req.params.id = req.user.name;
    next();
}
// Make App use router
app.use('/', router);

app.route('/me')
    .get(auth, tself, teachers.get);

app.route('/teachers')
    .post(auth, perms(3), teachers.new)
    .get(auth, perms(3), teachers.getAll);

app.route('/teachers/:id')
    .get(auth, perms(3), teachers.get);

app.route('/teachers/editDetails')
    .post(teachers.updateDetails);

app.route('/teachers/editPasswd')
    .post(teachers.editPasswd);

app.route('/teachers/editClasses')
    .post(teachers.editClasses);

app.route('/teachers/:id/del')
    .post(auth, perms(3), teachers.delete);


app.route('/schools')
    .post(auth, perms(3), schools.new)
    .get(auth, perms(3), schools.getAll);

app.route('/students')
    .post(auth, perms(2), students.new)
    .get(auth, perms(2), students.getAll);

app.route('/students/:id')
    .get(auth, perms(2), students.get);

app.route('/questions')
    .post(auth, perms(2), questions.new)
    .get(auth, perms(2), questions.getAll);

app.route('/questions/:id')
    .get(auth, perms(2), questions.get);

app.route('/tests')
    .post(auth, perms(2), questions.new)
    .get(auth, perms(2), questions.getAll);

app.route('/tests/:id')
    .get(auth, perms(2), questions.get);
/*


 //Professores
 app.post('/teachers', auth, teachers.new);
 app.post('/teachers/:id',  auth, teachers.upDate);
 app.get('/teachers',  auth, perms(4),teachers.getAll);
 app.get('/teachers/:id',  auth, teachers.get);

 app.get('/photo/:db/:id/:photo',  auth, teachers.photo)
 //Alunos
 app.post('/students',  auth, students.new);
 app.post('/students/:id',  auth, students.upDate);
 app.get('/students',  auth, students.getAll);
 app.get('/students/:id',  auth, students.get);

 //Escolas
 app.post('/schools',  auth, schools.new);
 app.post('/schools/:id',  auth, schools.upDate);
 app.get('/schools',  auth, schools.getAll);
 app.get('/schools/:id',  auth, schools.get);

 //Testes
 app.post('/tests',  auth, tests.new);
 app.post('/tests/:id',  auth, tests.upDate);
 app.get('/tests',  auth, tests.getAll);
 app.get('/tests/:id', auth,  tests.get);

 //Perguntas
 app.post('/questions', auth,  questions.new);
 app.post('/questions/:id',  auth, questions.upDate);
 app.get('/questions', auth,  questions.getAll);
 app.get('/questions/:id', auth,  questions.get);

 //Resoluçoes
 app.get('/submissions',  auth, submissions.getAll);
 app.post('/submissions/:id', auth,  submissions.upDate);
 app.get('/submissions/:id',  auth, submissions.get);


 // app.post('/login', session.login);
 */


var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Listening on %d'.green, app.get('port'));
});