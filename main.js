require('colors');

//Database
var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('dev_professores');

//Requirements
var express = require('express'),
    bodyParser = require('body-parser'),
    basicAuth = require('basic-auth'),
    http = require('http'),
    busboy = require('connect-busboy'); //middleware for form/file upload

//Path Variable
var path = require('path'),
    fs = require('fs-extra'),       //File System - for file manipulation
    mime = require('mime');

//Route Controllers
var schools = require('./routes/schools'),
    teachers = require('./routes/teachers'),
    students = require('./routes/students'),
    tests = require('./routes/tests'),
    resolutions = require('./routes/resolutions'),
    questions = require('./routes/questions'),
    submissions = require('./routes/submissions'),
    fileHandler = require('./routes/fileHandler');

//Express Variable
var app = express();

//Set BusBoy to Parse Form Immediately
app.use(busboy({immediate: true}));

/**
 * Body Parser Config
 */
app.use(bodyParser({limit: '50mb'}));                       //Data Transfer Max Size
app.use(bodyParser.urlencoded({extended: true}));           //Set URL Enconde
app.use(bodyParser.json());                                 //Parse Body Data To JSON
app.use(express.static(path.join(__dirname, '/public')));   //Public Folder Path


//Set our server port
app.set('port', process.env.PORT || 8081);


// get an instance of router
var router = express.Router();

// Route middleware that will happen on every request
router.use(function (req, res, next) {
    // log each request to the console
    console.log("Route Request: ".blue + req.method, req.url);
    next();
});

//Build Body and Parse Files When FormData is Uploaded insted of JSON
router.use(function (req, res, next) {
    if (req.busboy != null) {

        req.busboy.on('file', function (fieldname, file, filename) {

            req.body['filePath'] = __dirname + "\\tmp\\" + filename;
            console.log("Uploading: " + filename);
            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '\\tmp\\' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log("Upload Finished of " + filename);
            });

        });


        req.busboy.on('field', function (key, value) {
            req.body[key] = value;
        });

        req.busboy.on('finish', function () {
            next();
        });

    }
    else{
        next();
    }

});

// Validating Login Credentials
var auth = function (req, res, next) {
    //Check For Login User
    var login = basicAuth(req);
    //console.log(login);
    if (login) {
        db.get(login.name, {revs_info: true}, function (err, body) {
            if (!err) {
                if (body.password == login.pass) {
                    //Login Successfully
                    console.log("Login Successfully");
                    req.user = {name: login.name, perm: body.permissionLevel};
                    next();
                }
                else {
                    //Report Error (Rong Password)
                    console.log(body.password);
                    console.log("Login Attempt Failed - Wrong info");
                    res.status(401).json({});
                }
            }
            else {
                //Report Error (Rong Username)
                console.log("Login Attempt Failed" + err);
                res.status(401).json({});
            }

        });
    }
    else {
        //Report Error (No Auth Credentials)
        console.log("Login Attempt Failed - Missing user");
        res.status(401).json({});
    }

};

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
};

// Make Teacher Query Be On Logged User
var tself = function (req, res, next) {
    req.params.id = req.user.name;
    next();
};

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
    .post(auth, perms(3), teachers.updateDetails);

app.route('/teachers/editPasswd')
    .post(auth, perms(3), teachers.editPasswd);

app.route('/teachers/editClasses')
    .post(auth, perms(3), teachers.editClasses);

app.route('/teachers/rmvClass')
    .post(auth, perms(3), teachers.rmvClass);

app.route('/teachers/:id/del')
    .post(auth, perms(3), teachers.delete);

app.route('/schools')
    .post(auth, perms(3), schools.new)
    .get(auth, perms(3), schools.getAll);

app.route('/schools/:id')
    .post(auth, perms(3), schools.editSchool)
    .get(auth, perms(3), schools.get);

//Only Return Teacher Related Students
app.route('/students')
    .post(auth, perms(2), students.new)
    .get(auth, tself, perms(2), students.getStudents);


app.route('/students/:id')
    .post(auth, perms(2), students.editStudent)
    .get(auth, perms(2), students.get);

app.route('/questions')
    .post(auth, tself, perms(2), questions.test)
    .get(auth, perms(2), questions.getAll);

app.route('/questions/:id')
    .get(auth, perms(2), questions.get);

//Tests
app.route('/tests')
    .get(auth, tself, perms(2), tests.getAll);

//Resolutions
app.route('/resolutions')
    .get(auth, tself, perms(2), resolutions.getAll);

//This Needs To Be Revised
app.route('/schools/class')
    .post(auth, perms(2), tself, schools.newClass);

app.route('/schools/:id/newclass')
    .post(auth, perms(3), schools.newClass);

app.route('/schools/:id/removeclass')
    .post(auth, perms(3), schools.removeClass);

app.route('/schools/:id/remove')
    .post(auth, perms(3), schools.removeSchool);

//Student Routing
app.route('/students/:id/remove')
    .post(auth, perms(3), students.removeStudent);

//File Handler
app.route("/file/:db/:id/:filename")
    .get(fileHandler.fileDownload)

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