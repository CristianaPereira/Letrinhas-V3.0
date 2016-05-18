var nano = require('nano')('http://letrinhas:ad78gsa76gg98G68AG@127.0.0.1:5984');

nano.db.destroy('let_teachers');
nano.db.destroy('let_schools');
nano.db.destroy('let_students');
nano.db.destroy('let_questions');
nano.db.destroy('let_categories');
nano.db.destroy('let_tests');
nano.db.destroy('let_resolutions');

nano.db.create('let_teachers');
nano.db.create('let_schools');
nano.db.create('let_students');
nano.db.create('let_questions');
nano.db.create('let_categories');
nano.db.create('let_tests');
nano.db.create('let_resolutions');

var prof = nano.db.use('let_teachers');
prof.insert({
    "_id": "professor@mail.pt",
    "_rev": "3-4d1fdf35c93a85691853277107c6ac16",
    "estado": true,
    "nome": "Professor De Teste",
    "password": "teste1234",
    "pin": 1234,
    "telefone": 912587452,
    "tipoFuncionario": "Professor"
});
prof.insert({
    "_id": "reginacenoura@gmail.com",
    "_rev": "1-f19c5df1880827d4ebbecb41f89bc6eb",
    "estado": true,
    "nome": "Professora Regina Cenoura",
    "password": "teste1234",
    "pin": 1234,
    "telefone": 123456789,
    "tipoFuncionario": "Administrador do Sistema"
});
console.log('Databases reset!');
