window.QuestionsTextNew = Backbone.View.extend({
  events: {
    "submit": "validaSubmissao",
    "click #buttonCancelar": "cancelTest",
    "click #subTxt": "verificarCampos",
    "blur input": "verifica",
    "click #txtGrava": "showEqualizer",
    "click #record": "eGrava",
    "change #inputSom": "addSom",
  },

  //Obtém o nome do ficheiro seleccionado , exibe-o e coloca a border a cinzento
  addSom: function() {
    var files = $("#inputSom").prop('files');
    $("#soundPath").attr("placeholder", files[0].name);
    $("#soundPath").css('border', 'solid 1px #cccccc');
    return true;
  },

  eGrava: function(e) {
    e.preventDefault();
    var self = this;
    if ($("#record").attr("value") == 1) {
      $("#save").attr("style", "color:#80ccee;font-size:16px");
      $("#record").html('<span class="glyphicon glyphicon-record" style="color:#ee0000"></span> Gravar');
      $("#record").attr("value", 0);
    } else {
      $("#save").attr("style", "visibility:hidden");
      $("#record").html('<span class="glyphicon glyphicon-stop" style="color:#ee0000"></span> Parar');
      $("#record").attr("value", 1);
      $("#Rplayer").attr("style", "visibility:hidden;width:60%");
      $("#Rplayer").stop();
    }
    toggleRecording(e.target);
  },

  showEqualizer: function(e) {
    e.preventDefault();
    $("#rTexto").text($("#InputTexto").val());
    $("#myModalRecord").modal("show");
    initAudio();
  },

  cancelTest: function(e) {
    e.preventDefault();
    window.history.back();
  },

  validaSubmissao: function(e) {
    var self = this;
    if (self.verificarCampos()) {
      //adicioinar parametros invisíveis ao form, para tratamento na inserção
      var input = $("<input>").attr("type", "hidden")
          .attr("name", "profID")
          .val(window.localStorage.getItem("ProfID"));
      $('#txtNewForm').append($(input));
    } else {
      e.preventDefault();
    }
  },


  initialize: function() {
    var self = this;
    self.bd = 'dev_testes';
    self.bd2 = 'dev_perguntas';
    self.site = 'http://185.15.22.235:5984';
  },

  //Verifica se os campos da class "mandatory"(obrigatorios) estão preeenchidos, caso não estejam,
  //coloca a sua border a vermelho e mostra uma mensagem de obrigatoriedade
  verificarCampos: function() {
    //buscar todos os campos obrigatórios
    var myEl = document.getElementsByClassName('mandatory');
    var cont = 0;
    //verifica se estão preenchidos
    for (i = 0; i < myEl.length; i++) {
      if ($(myEl[i]).val().length != 0) {
        cont++;
        $(myEl[i]).css('border', 'solid 1px #cccccc');
      } else {
        $(myEl[i]).css('border', 'solid 1px #dd4b39');
      }
    }
    //Verifica se foi seleccionado audio e se todos os campos estão preenchidos
    if ($("#inputSom").prop('files').length != 0 && cont == myEl.length) {
      $("#soundPath").css('border', 'solid 1px #cccccc');
      return true;
    } else {
      $("#soundPath").css('border', 'solid 1px #dd4b39');
      return false;
    }
  },

  //Ao perder o foco, caso tenha texto, coloca a border a conzento
  verifica: function(e) {
    if ($(e.currentTarget).val().length != 0) {
      $(e.currentTarget).css('border', 'solid 1px #cccccc');
    }
  },
  render: function() {
    var self = this;

    $(this.el).html(this.template());

    //verificar se está logado
    var controlo = window.localStorage.getItem("Logged");
    if (!controlo) {
      console.log('Não Logado');
      app.navigate('/#', {
        trigger: true
      });
      return null;
    }
    var role = '' + window.localStorage.getItem('Role');
    //se não é professor, volta para menuprincipal
    if (role != "Professor") {
      app.navigate('/#', {
        trigger: true
      });
      return null;
    }

    setTimeout(function() {
      //verificar se está a Clonar
      if (window.sessionStorage.getItem("ClonarTeste")) {
        console.log("está a clonar!!");
        self.vaiClonar(window.sessionStorage.getItem("ClonarTeste"));
      } else {
        //desbloquear os inputs
        $("#InputTitulo").attr("disabled", false);
        $("#InputDescricao").attr("disabled", false);
        $("#inputSom").attr("disabled", false);
        $("#InputPergunta").attr("disabled", false);
        $("#InputTexto").attr("disabled", false);
      }
      console.log(window.sessionStorage.getItem("ClonarTeste"));
      window.sessionStorage.removeItem("ClonarTeste");
    }, 10);
    return this;
  },

  vaiClonar: function(teste) {
    var self = this;

    modem('GET', 'tests/' + teste, function(item) {
      $("#InputTitulo").val("Colne de " + item.titulo);
      $("#InputDescricao").val(item.descricao);
      modem('GET', 'questions/' + item.perguntas[0], function(perg) {
        $("#InputPergunta").val(perg.pergunta);
        $("#InputTexto").text(perg.conteudo.texto);
        //disciplina
        switch (perg.disciplina) {
          case "Português":
            document.getElementById("selectDiscip").selectedIndex = 0;
            break;
          case "Inglês":
            document.getElementById("selectDiscip").selectedIndex = 1;
            break;
          default:
            document.getElementById("selectDiscip").selectedIndex = 2;
        }
        //ano escolar
        document.getElementById("selectAno").selectedIndex = (parseInt(perg.anoEscolar) - 1);

        //################################################################################
        //som
        //Dúvida!!
        //Recolocar o attachment no input!
        //$("#inputSom").val(self.site+'/'+self.bd2+'/'+item._id+'/voz.mp3');
        //################################################################################

        $("#InputTitulo").attr("disabled", false);
        $("#InputDescricao").attr("disabled", false);
        $("#inputSom").attr("disabled", false);
        $("#InputPergunta").attr("disabled", false);
        $("#InputTexto").attr("disabled", false);
      }, function(errQ) {
        console.log('Error getting question ' + item.perguntas[0]);
        console.log(errQ);
      });

    }, function(erro) {
      console.log('Error getting test ' + teste);
      console.log(erro);
    });
  }
});