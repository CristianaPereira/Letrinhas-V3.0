var nano = require('nano')('http://letrinhas:ad78gsa76gg98G68AG@127.0.0.1:5984');

nano.db.destroy('dev_professores');
nano.db.destroy('dev_escolas');
nano.db.destroy('dev_alunos');
nano.db.destroy('dev_perguntas');
nano.db.destroy('dev_testes');
nano.db.destroy('dev_resolucoes');

nano.db.create('dev_professores');
nano.db.create('dev_escolas');
nano.db.create('dev_alunos');
nano.db.create('dev_perguntas');
nano.db.create('dev_testes');
nano.db.create('dev_resolucoes');

var prof = nano.db.use('dev_professores');
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
