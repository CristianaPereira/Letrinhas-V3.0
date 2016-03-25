
window.UserView = Backbone.View.extend({
  events:{
    "click #btnUserEdit": "editUser",
    "click .SelTurma":"mostraTurma",
  },

  verAluno:function (btn) {
    //Variavel a enviar, para depois poder buscar os dados do aluno a consultar
    window.sessionStorage.setItem("Aluno", $(btn).attr("val"));
    app.navigate('student/view', {
      trigger: true
    });
  },

  mostraTurma:function(e){
    var self=this;
    //preencher um modal...
    var btn = e.toElement;

    $("#classProfessor").html('');
    $("#classAlunos").html('');
    var tID = $(btn).attr("turma");
    var eID = $(btn).attr("escola");

    modem('GET','schools/'+eID, function(escola){
      $("#myModalLabel").html('<img src="../img/letrinhas2.png" style="height:40px">'
                         +'<img src="../img/escola1.png"  style="height:40px;" >'////////Continua!!!!
                         +$(btn).text()+' - '+ escola.nome);

      for(i=0;i< escola.turmas.length; i++ ){
        if(escola.turmas[i]._id == tID){
          //preencher professores
          if(escola.turmas[i].professores.length>0){
            for(p=0; p< escola.turmas[i].professores.length; p++){
              modem('GET','teachers/'+escola.turmas[i].professores[p].id,function(professor){
                var prof = '<div class="col-md-6 ">'
                           +'<img src="photo/'+self.bd+'/'+professor._id+'/prof.jpg" style="height:80px;" > '
                           +'<br><label>'+professor.nome+'</label>'
                           +'</div>';
                $("#classProfessor").append(prof);
              },
              function(error) {
                console.log('Error getting the teacher id:'+escola.turmas[i].professores[p].id);
              });
            }
           }
           else{
             $("#classProfessor").append("<label>Esta turma ainda não tem professores.</label>");
           }

          //preencher alunos
          modem('GET','students', function(alunos){
            var contAl=0;
            for(a=0;a<alunos.length;a++){
              if(alunos[a].doc.escola == eID &&
                alunos[a].doc.turma == tID){
                var alun;
                alun='<div class="col-md-4"><br>'
                      +'<div class="btn-block btn btn-default alunos" val="'+alunos[a].doc._id+'">'
                        +'<img src="data:'+alunos[a].doc._attachments['aluno.jpg'].content_type
                        +';base64,'
                        + alunos[a].doc._attachments['aluno.jpg'].data
                        +'" style="height:80px;" > '
                        +'<br><label>'+alunos[a].doc.nome+'</label><br>'
                      +'</div>'
                    +'</div>';

                $("#classAlunos").append(alun);
                contAl++;
             }

           }
            if(contAl==0) $("#classAlunos").append("<label>Esta turma ainda não tem alunos.</label>");
            else{
              //criar eventos
              var myBotoes = document.getElementsByClassName("alunos");
              for (var i = 0; i < myBotoes.length; i++) {
                myBotoes[i].addEventListener('click', function() {
                              self.verAluno(this);
                            }, false);
              }
            }
          },
          function(error) {
            console.log('Error getting the students list');
          });
        }
      }
    },
    function(error) {
      console.log('Error getting the school id:'+eID);
    });
    //apresenta o Modal
    $("#myModalTurma").modal("show");


  },

  editUser: function (obj) {
    //Variavel a enviar, para depois poder buscar os dados do professor a editar
    window.sessionStorage.setItem("ProfEditar", window.localStorage.getItem('ProfID'));
    app.navigate('teachers/edit', {
      trigger: true
    });
  },

  initialize: function () {
    var self=this;

    self.bd='dev_professores';
    self.bd2='dev_escolas';
    self.site='http://185.15.22.235:5984';
  },

  render: function () {
    $(this.el).html(this.template());

    setTimeout(function(){
      $("#user").text(window.localStorage.getItem("ProfID"));
    },2);

    var self=this;

    modem('GET', 'me', function(user) {
      console.log(user);
      $("#user").text(user.nome);
      //mostrar os dados do utilizadores
      $("#userFoto").attr('src',user.imgb64);
      $("#tipoFunc").text(user.tipoFuncionario);
      $("#nome").text(user.nome);
      $("#email").text(user._id);
      $("#dados").text("Dados de "+user._id);
      $("#telefone").text(user.telefone);

      modem('GET', 'schools', function(escolas) {
        //Montar as turmas que o utilizador pertence
        var userr = window.localStorage.getItem("ProfID");
        var conta=0;
        var estaEscola=false;
        var estaTurma=false;
        var linhaEscola, btnTurma;

        for (var i = 0; i < escolas.length; i++) {
          btnTurma='<div class="col-md-8" style="height:160px;overflow:auto">';
          linhaEscola='<div class="col-md-4" style="height:160px;" >';
          for (var j = 0; j < escolas[i].doc.turmas.length; j++) {
            for (var k = 0; k < escolas[i].doc.turmas[j].professores.length; k++) {
              if(escolas[i].doc.turmas[j].professores[k].id== userr){
                conta++;
                estaTurma=true;
                estaEscola=true;
                break;
              }
            }
            //construir o botão de turma
            if(estaTurma){
              btnTurma+='<div class="col-md-4"><button class="btn-sm btn-info btn-block SelTurma"'
                        +' escola="'+escolas[i].doc._id+'" turma="'+escolas[i].doc.turmas[j]._id+'">'+escolas[i].doc.turmas[j].ano
                      +'º '+escolas[i].doc.turmas[j].nome+'</button><br></div> ';
              estaTurma=false;
            }
          }
          //cria linha de escola e insere os botões de turmas
          if(estaEscola){
            linhaEscola+='<img src="data:'+escolas[i].doc._attachments['escola.jpg'].content_type+';base64,'
                                    +escolas[i].doc._attachments['escola.jpg'].data
                                    +'"style="height:100px; max-width:200px"><br>'
                          +'<label class="badge">'+escolas[i].doc.nome+'</label><hr></div>';
            btnTurma+='</div>';
            $("#asMinhasTurmas").append(linhaEscola);
            $("#asMinhasTurmas").append(btnTurma);
            estaEscola=false;
          }
        }

        $("#numTurmas").text(conta);

      }, function(erro2) {
        console.log('Error getting schools');
      });

    }, function(error) {
      console.log('Error getting user '+window.localStorage.getItem("ProfID"));
    });



    return this;
  }

});
