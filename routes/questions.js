require('colors');

var nano = require('nano')(process.env.COUCHDB);
var db = nano.use('dev_testes');
var db2 = nano.use('dev_perguntas');


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

exports.newOld = function (req, res) {
    console.log('questions new, allmost completeeeeee!'.yellow);

    var dati = new Date();
    var idPerg = 'P' + dati.getTime();
    var idTeste = 'T' + dati.getTime();
    var pergunta;

    switch (req.body.tipo) {
        case "Texto":
            pergunta = {
                "anoEscolar": req.body.ano_escolar,
                "titulo": req.body.titulo,
                "disciplina": req.body.disciplina,
                "pergunta": req.body.pergunta,
                "conteudo": {
                    "texto": req.body.texto,
                },
                "tipoTeste": req.body.tipo,
                "dataCri": dati,
                "estado": true,
                "profID": req.body.profID,
            };
            var teste = {
                "titulo": req.body.titulo,
                "descricao": req.body.descricao,
                "disciplina": req.body.disciplina,
                "anoEscolar": req.body.ano_escolar,
                "perguntas": [idPerg],
                "data": dati,
                "estado": true,
                "professorId": req.body.profID,
                "tipo": req.body.tipo,
                "nRepeticoes": 0,
            };

            var file;
            if (req.files) file = req.files.file;

            var imgData = require('fs').readFileSync(file.path);

            db.multipart.insert(pergunta, [{
                name: 'voz.mp3',
                data: imgData,
                content_type: 'audio/mp3'
            }], idPerg, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log("Aqui mesmo!!");
                console.log('questions added'.red);
                //res.json(body);
                //res.json({'result': 'ok'});
                res.redirect('/#tests');
            });

            db2.insert(teste, idTeste, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('teste added'.green);

            });

            break;
        case "Lista":
            pergunta = {
                "anoEscolar": req.body.ano_escolar,
                "titulo": req.body.titulo,
                "disciplina": req.body.disciplina,
                "pergunta": req.body.pergunta,
                "conteudo": {
                    "palavrasCL1": getPalavras(req.body.cl1),
                    "palavrasCL2": getPalavras(req.body.cl2),
                    "palavrasCL3": getPalavras(req.body.cl3),
                },
                "tipoTeste": req.body.tipo,
                "dataCri": dati,
                "estado": true,
                "professorId": req.body.profID,

            };
            var teste = {
                "titulo": req.body.titulo,
                "descricao": req.body.descricao,
                "disciplina": req.body.disciplina,
                "anoEscolar": req.body.ano_escolar,
                "perguntas": [idPerg],
                "data": dati,
                "estado": true,
                "professorId": req.body.profID,
                "tipo": req.body.tipo,
                "nRepeticoes": 0,
            };

            var file;
            if (req.files) file = req.files.file;

            var imgData = require('fs').readFileSync(file.path);

            db.multipart.insert(pergunta, [{
                name: 'voz.mp3',
                data: imgData,
                content_type: 'audio/mp3'
            }], idPerg, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('new question added'.red);
                //res.json(body);
                //res.json({'result': 'ok'});
                res.redirect('/#tests');
            });

            db2.insert(teste, idTeste, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('teste added'.green);
            });
            break;
        case "Multimédia":
            var opcoes = new Array();
            var anexos = new Array();
            for (i = 0; i < req.body.numResp; i++) {
                var cntd;
                switch (req.body.MtipoResp) {
                    case 'texto':
                        cntd = req.body['resposta' + i];
                        break;
                    case 'imagem':
                        cntd = "";

                        var file;
                        if (req.files) file = req.files['resposta' + i];

                        var imgData = require('fs').readFileSync(file.path);

                        var anx = {
                            name: 'op' + (i + 1) + '.jpg',
                            data: imgData,
                            content_type: 'image/jpg'
                        };
                        anexos.push(anx);
                        break;
                    default:
                }
                var op = {
                    "tipo": req.body.MtipoResp,
                    "conteudo": cntd,
                };
                opcoes.push(op);
            }

            var conteudo;
            switch (req.body.MtipoPerg) {
                case 'texto':
                    conteudo = {
                        "idCategoria": 0,
                        "tipoDoCorpo": req.body.MtipoPerg,
                        "corpo": req.body.corpo,
                        "opcoes": opcoes,
                        "opcaoCerta": 1,
                    };
                    break;
                case 'imagem':
                    var file;
                    if (req.files) file = req.files.corpo;

                    var imgData = require('fs').readFileSync(file.path);
                    conteudo = {
                        "idCategoria": 0,
                        "tipoDoCorpo": req.body.MtipoPerg,
                        "corpo": "",
                        "opcoes": opcoes,
                        "opcaoCerta": "1",
                    };
                    var anx = {
                        name: 'corpo.jpg',
                        data: imgData,
                        content_type: 'image/jpg'
                    };
                    anexos.push(anx);
                    break;

                case 'audio':
                    var file;
                    if (req.files) file = req.files.corpo;

                    var imgData = require('fs').readFileSync(file.path);
                    conteudo = {
                        "idCategoria": 0,
                        "tipoDoCorpo": req.body.MtipoPerg,
                        "corpo": "",
                        "opcoes": opcoes,
                        "opcaoCerta": "1",
                    };
                    var anx = {
                        name: 'corpo.mp3',
                        data: imgData,
                        content_type: 'audio/mp3'
                    };
                    anexos.push(anx);
                    break;
                default:

            }

            pergunta = {
                "anoEscolar": req.body.ano_escolar,
                "titulo": req.body.tituloPerg,
                "disciplina": req.body.disciplina,
                "pergunta": req.body.Mpergunta,
                "conteudo": conteudo,
                "tipoTeste": req.body.tipo,
                "dataCri": dati,
                "estado": true,
                "professorId": req.body.profIDs,

            };

            db.multipart.insert(pergunta, anexos, idPerg, function (err, body) {
                if (err) {
                    console.log('questions multimédia new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('questions Multimedia added'.green);

                res.redirect('/#questionsMultimedia/new');
            });

            //Terminar
            break;
        case "Interpretação":
            var posicoes = new Array();
            for (var i = 0; i < req.body.nMarcas; i++) {
                posicoes[i] = req.body['pos' + i];
            }

            pergunta = {
                "anoEscolar": req.body.ano_escolar,
                "titulo": req.body.titulo,
                "disciplina": req.body.disciplina,
                "pergunta": req.body.pergunta,
                "conteudo": {
                    "texto": req.body.texto,
                    "posicaoResposta": posicoes,
                },
                "tipoTeste": req.body.tipo,
                "dataCri": dati,
                "estado": true,
                "professorId": req.body.profID,

            };

            var teste = {
                "titulo": req.body.titulo,
                "descricao": req.body.descricao,
                "disciplina": req.body.disciplina,
                "anoEscolar": req.body.ano_escolar,
                "perguntas": [idPerg],
                "data": dati,
                "estado": true,
                "professorId": req.body.profID,
                "tipo": req.body.tipo,
                "nRepeticoes": 0,
            };

            var file;
            if (req.files) file = req.files.file;

            var imgData = require('fs').readFileSync(file.path);

            db.multipart.insert(pergunta, [{
                name: 'voz.mp3',
                data: imgData,
                content_type: 'audio/mp3'
            }], idPerg, function (err, body) {
                if (err) {
                    console.log('questions interp new, an error ocourred'.red);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('questions interp added'.green);
                //res.json(body);
                //res.json({'result': 'ok'});
                res.redirect('/#tests');
            });


            db2.insert(teste, idTeste, function (err, body) {
                if (err) {
                    console.log('questions interp new, an error ocourred in new test'.red);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('teste added'.green);
            });
            break;
    }
    ;


};

exports.getAll = function (req, res) {
    console.log('all questions'.green);

    db.list({'include_docs': true, 'limit': undefined, 'descending': true}, function (err, body) {
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

//Função para devolver um array de palavras
function getPalavras(texto) {
    var listaPalavras = new Array();
    var palavra = '';

    var isCaracter = false;
    for (i = 0; i < texto.length; i++) {
        //de acordo com a tabela ascii 1º caracter possivel '!' CODE 33
        if (texto.charCodeAt(i) < 33) {
            //se o caracter anterior for válido
            if (isCaracter) {
                //enterga a palavra à lista
                listaPalavras.push(palavra);
                //limpa a palavra
                palavra = '';
                //não e um caracter válido (ex: "enter", "space", "tab")
                isCaracter = false;
            }
        }
        else {
            //adiciona o caracter à palavra
            palavra += texto.charAt(i);
            //confirma que era uma caracter
            isCaracter = true;
        }
    }

    //entregar o resto
    if (palavra.length > 0) {
        listaPalavras.push(palavra);
    }

    return listaPalavras;
}


// R E V A M P
exports.new = function (req, res) {

    //Insert New Test
    console.log(req.files);


    return false;

    console.log('questions new, allmost completeeeeee!'.yellow);

    var dati = new Date();
    var idPerg = 'P' + dati.getTime();
    var idTeste = 'T' + dati.getTime();
    var pergunta;

    switch (req.body.tipo) {
        case "Texto":
            pergunta = {
                "anoEscolar": req.body.ano_escolar,
                "titulo": req.body.titulo,
                "disciplina": req.body.disciplina,
                "pergunta": req.body.pergunta,
                "conteudo": {
                    "texto": req.body.texto,
                },
                "tipoTeste": req.body.tipo,
                "dataCri": dati,
                "estado": true,
                "profID": req.body.profID,
            };
            var teste = {
                "titulo": req.body.titulo,
                "descricao": req.body.descricao,
                "disciplina": req.body.disciplina,
                "anoEscolar": req.body.ano_escolar,
                "perguntas": [idPerg],
                "data": dati,
                "estado": true,
                "professorId": req.body.profID,
                "tipo": req.body.tipo,
                "nRepeticoes": 0,
            };

            var file;
            if (req.files) file = req.files.file;

            var imgData = require('fs').readFileSync(file.path);

            db.multipart.insert(pergunta, [{
                name: 'voz.mp3',
                data: imgData,
                content_type: 'audio/mp3'
            }], idPerg, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log("Aqui mesmo!!");
                console.log('questions added'.red);
                //res.json(body);
                //res.json({'result': 'ok'});
                res.redirect('/#tests');
            });

            db2.insert(teste, idTeste, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('teste added'.green);

            });

            break;
        case "Lista":
            pergunta = {
                "anoEscolar": req.body.ano_escolar,
                "titulo": req.body.titulo,
                "disciplina": req.body.disciplina,
                "pergunta": req.body.pergunta,
                "conteudo": {
                    "palavrasCL1": getPalavras(req.body.cl1),
                    "palavrasCL2": getPalavras(req.body.cl2),
                    "palavrasCL3": getPalavras(req.body.cl3),
                },
                "tipoTeste": req.body.tipo,
                "dataCri": dati,
                "estado": true,
                "professorId": req.body.profID,

            };
            var teste = {
                "titulo": req.body.titulo,
                "descricao": req.body.descricao,
                "disciplina": req.body.disciplina,
                "anoEscolar": req.body.ano_escolar,
                "perguntas": [idPerg],
                "data": dati,
                "estado": true,
                "professorId": req.body.profID,
                "tipo": req.body.tipo,
                "nRepeticoes": 0,
            };

            var file;
            if (req.files) file = req.files.file;

            var imgData = require('fs').readFileSync(file.path);

            db.multipart.insert(pergunta, [{
                name: 'voz.mp3',
                data: imgData,
                content_type: 'audio/mp3'
            }], idPerg, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('new question added'.red);
                //res.json(body);
                //res.json({'result': 'ok'});
                res.redirect('/#tests');
            });

            db2.insert(teste, idTeste, function (err, body) {
                if (err) {
                    console.log('questions new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('teste added'.green);
            });
            break;
        case "Multimédia":
            var opcoes = new Array();
            var anexos = new Array();
            for (i = 0; i < req.body.numResp; i++) {
                var cntd;
                switch (req.body.MtipoResp) {
                    case 'texto':
                        cntd = req.body['resposta' + i];
                        break;
                    case 'imagem':
                        cntd = "";

                        var file;
                        if (req.files) file = req.files['resposta' + i];

                        var imgData = require('fs').readFileSync(file.path);

                        var anx = {
                            name: 'op' + (i + 1) + '.jpg',
                            data: imgData,
                            content_type: 'image/jpg'
                        };
                        anexos.push(anx);
                        break;
                    default:
                }
                var op = {
                    "tipo": req.body.MtipoResp,
                    "conteudo": cntd,
                };
                opcoes.push(op);
            }

            var conteudo;
            switch (req.body.MtipoPerg) {
                case 'texto':
                    conteudo = {
                        "idCategoria": 0,
                        "tipoDoCorpo": req.body.MtipoPerg,
                        "corpo": req.body.corpo,
                        "opcoes": opcoes,
                        "opcaoCerta": 1,
                    };
                    break;
                case 'imagem':
                    var file;
                    if (req.files) file = req.files.corpo;

                    var imgData = require('fs').readFileSync(file.path);
                    conteudo = {
                        "idCategoria": 0,
                        "tipoDoCorpo": req.body.MtipoPerg,
                        "corpo": "",
                        "opcoes": opcoes,
                        "opcaoCerta": "1",
                    };
                    var anx = {
                        name: 'corpo.jpg',
                        data: imgData,
                        content_type: 'image/jpg'
                    };
                    anexos.push(anx);
                    break;

                case 'audio':
                    var file;
                    if (req.files) file = req.files.corpo;

                    var imgData = require('fs').readFileSync(file.path);
                    conteudo = {
                        "idCategoria": 0,
                        "tipoDoCorpo": req.body.MtipoPerg,
                        "corpo": "",
                        "opcoes": opcoes,
                        "opcaoCerta": "1",
                    };
                    var anx = {
                        name: 'corpo.mp3',
                        data: imgData,
                        content_type: 'audio/mp3'
                    };
                    anexos.push(anx);
                    break;
                default:

            }

            pergunta = {
                "anoEscolar": req.body.ano_escolar,
                "titulo": req.body.tituloPerg,
                "disciplina": req.body.disciplina,
                "pergunta": req.body.Mpergunta,
                "conteudo": conteudo,
                "tipoTeste": req.body.tipo,
                "dataCri": dati,
                "estado": true,
                "professorId": req.body.profIDs,

            };

            db.multipart.insert(pergunta, anexos, idPerg, function (err, body) {
                if (err) {
                    console.log('questions multimédia new, an error ocourred'.green);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('questions Multimedia added'.green);

                res.redirect('/#questionsMultimedia/new');
            });

            //Terminar
            break;
        case "Interpretação":
            var posicoes = new Array();
            for (var i = 0; i < req.body.nMarcas; i++) {
                posicoes[i] = req.body['pos' + i];
            }

            pergunta = {
                "anoEscolar": req.body.ano_escolar,
                "titulo": req.body.titulo,
                "disciplina": req.body.disciplina,
                "pergunta": req.body.pergunta,
                "conteudo": {
                    "texto": req.body.texto,
                    "posicaoResposta": posicoes,
                },
                "tipoTeste": req.body.tipo,
                "dataCri": dati,
                "estado": true,
                "professorId": req.body.profID,

            };

            var teste = {
                "titulo": req.body.titulo,
                "descricao": req.body.descricao,
                "disciplina": req.body.disciplina,
                "anoEscolar": req.body.ano_escolar,
                "perguntas": [idPerg],
                "data": dati,
                "estado": true,
                "professorId": req.body.profID,
                "tipo": req.body.tipo,
                "nRepeticoes": 0,
            };

            var file;
            if (req.files) file = req.files.file;

            var imgData = require('fs').readFileSync(file.path);

            db.multipart.insert(pergunta, [{
                name: 'voz.mp3',
                data: imgData,
                content_type: 'audio/mp3'
            }], idPerg, function (err, body) {
                if (err) {
                    console.log('questions interp new, an error ocourred'.red);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('questions interp added'.green);
                //res.json(body);
                //res.json({'result': 'ok'});
                res.redirect('/#tests');
            });


            db2.insert(teste, idTeste, function (err, body) {
                if (err) {
                    console.log('questions interp new, an error ocourred in new test'.red);

                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                console.log('teste added'.green);
            });
            break;
    }
    ;


};

exports.test = function (req, res) {

    console.log(req.body);

    //Date And ID's Generator
    var $date = new Date();
    var $idQuest = 'Q' + $date.getTime();
    var $idTest = 'T' + $date.getTime();

    //Image Data Sync
    var $imgData = fs.readFileSync(req.body.filePath);

    //Check if File is a MP3 File
    if ((mime.lookup(req.body.filePath)).startsWith("audio")) {

        var $test = {
            "title": req.body.title,
            "class": req.body.class,
            "schoolYear": req.body.schoolYear,
            "nRepetitions": 0,
            "description": req.body.description,
            "questions": {0: $idQuest},
            "state": Boolean(req.body.state),
            "type": req.body.type,
            "profID": req.params.id,
            "creationDate": $date
        };

        var $question = {
            "title": req.body.title,
            "class": req.body.class,
            "schoolYear": req.body.schoolYear,
            "question": req.body.question,
            "description": req.body.description,
            "content": {"text": req.body.text},
            "state": Boolean(req.body.state),
            "type": req.body.type,
            "profID": req.params.id,
            "creationDate": $date
        };

        db.insert($test, $idTest, function (err, body) {
            if (err) {
                console.log('questions new, an error ocourred'.green);
                res.send(500);
            }
            else {
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
                        console.log('questions added'.red);
                    }

                });
            }
        });

    }
    else {
        console.log("Invalid File Type");
        res.send(401, {error: "Invalid File Type"});
    }


    res.send(200);

};