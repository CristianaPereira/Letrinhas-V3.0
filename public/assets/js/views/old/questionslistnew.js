window.QuestionsListNew = Backbone.View.extend({
  events: {
    "submit":"validaSubmissao",
    "click #buttonCancelar":"cancelTest",
    "blur .preenche":"verificarCampos",
    "click #lstGrava":"showEqualizer",
    "click #record":"eGrava",
  },

  eGrava:function(e){
    e.preventDefault();
    var self=this;
    if($("#record").attr("value")==1){
      $("#save").attr("style","color:#80ccee;font-size:16px");
      $("#record").html('<span class="glyphicon glyphicon-record" style="color:#ee0000"></span> Gravar');
      $("#record").attr("value",0);
    }
    else{
      $("#save").attr("style","visibility:hidden");
      $("#record").html('<span class="glyphicon glyphicon-stop" style="color:#ee0000"></span> Parar');
      $("#record").attr("value",1);
      $("#Rplayer").attr("style","visibility:hidden;width:60%");
      $("#Rplayer").stop();
    }

    toggleRecording(e.target);
  },

  showEqualizer:function(e){
    e.preventDefault();
    var self=this;
    //getColunas.
    $("#cl1").html(self.getPalavras($("#col1").val(),1));
    $("#cl2").html(self.getPalavras($("#col2").val(),2));
    $("#cl3").html(self.getPalavras($("#col3").val(),3));
    $("#myModalRecord").modal("show");
    initAudio();
  },

  cancelTest:function(e){
    e.preventDefault();
    window.history.back();
  },

  validaSubmissao:function(e){
    if ($("#InputDescricao").val().length==0) {
       e.preventDefault();
       //Teste
       //alert("descrição Vaizia");
       return false; //for old browsers
    } else{

      //adicioinar parametros invisíveis ao form, para tratamento na inserção
      var input = $("<input>").attr("type", "hidden")
                              .attr("name", "profID")
                              .val(window.localStorage.getItem("ProfID"));
      $('#listNewForm').append($(input));
    }

  },

  initialize: function() {
    var self=this;
    self.bd='dev_testes';
    self.bd2='dev_perguntas';
    self.site='http://185.15.22.235:5984';
  },

  render: function() {
    var self=this;
    $(this.el).html(this.template());

    //verificar se está logado
    var controlo=window.localStorage.getItem("Logged");
    if(!controlo){
      console.log('Não Logado');
      app.navigate('/#', {
          trigger: true
        });
        return null;
    }
    var role = ''+window.localStorage.getItem('Role');
    //se não é professor, volta para menuprincipal
    if(role != "Professor"){
        app.navigate('/#', {
          trigger: true
        });
        return null;
    }

    setTimeout(function(){
      //verificar se está a Clonar
      if(window.sessionStorage.getItem("ClonarTeste")){
        console.log("está a clonar!!");

        self.vaiClonar(window.sessionStorage.getItem("ClonarTeste"));
      }else{
        //desbloquear os inputs
        $("#InputTitulo").attr("disabled",false);
        $("#InputDescricao").attr("disabled",false);
        $("#inputSom").attr("disabled",false);
        $("#InputPergunta").attr("disabled",false);
        $("#col1").attr("disabled",false);
        $("#col2").attr("disabled",false);
        $("#col3").attr("disabled",false);
      }

      console.log(window.sessionStorage.getItem("ClonarTeste"));
      window.sessionStorage.removeItem("ClonarTeste");

    },10);
    return this;
  },
  vaiClonar: function(teste){
    var self=this;

    modem('GET', 'tests/'+teste, function(item) {
      $("#InputTitulo").val("Colne de "+item.titulo);
      $("#InputDescricao").val(item.descricao);
      modem('GET', 'questions/'+item.perguntas[0], function(perg) {
        $("#InputPergunta").val(perg.pergunta);
        //$("#InputTexto").text(perg.conteudo.texto);
        //disciplina
        switch (perg.disciplina) {
          case "Português":
              document.getElementById("selectDiscip").selectedIndex=0;
            break;
          case "Inglês":
              document.getElementById("selectDiscip").selectedIndex=1;
            break;
          default:
              document.getElementById("selectDiscip").selectedIndex=2;
        }
        //ano escolar
        document.getElementById("selectAno").selectedIndex=(parseInt(perg.anoEscolar) - 1 );

        for (var i = 0; i < perg.conteudo.palavrasCL1.length; i++) {
          $("#col1").append(perg.conteudo.palavrasCL1[i]+'\n');
        }
        for (var i = 0; i < perg.conteudo.palavrasCL2.length; i++) {
          $("#col2").append(perg.conteudo.palavrasCL2[i]+'\n');
        }
        for (var i = 0; i < perg.conteudo.palavrasCL3.length; i++) {
          $("#col3").append(perg.conteudo.palavrasCL3[i]+'\n');
        }

        //################################################################################
        //som
        //Dúvida!!
        //Recolocar o attachment no input!
        //$("#inputSom").val(self.site+'/'+self.bd2+'/'+item._id+'/voz.mp3');
        //################################################################################

        $("#InputTitulo").attr("disabled",false);
        $("#InputDescricao").attr("disabled",false);
        $("#inputSom").attr("disabled",false);
        $("#InputPergunta").attr("disabled",false);
        $("#col1").attr("disabled",false);
        $("#col2").attr("disabled",false);
        $("#col3").attr("disabled",false);
      }, function(errQ) {
        console.log('Error getting question '+item.perguntas[0]);
        console.log(errQ);
      });

    }, function(erro) {
      console.log('Error getting test '+teste);
      console.log(erro);
    });
  },

  verificarCampos: function() {
    var self=this;
    //buscar todos os campos obrigatórios
    var myEl = document.getElementsByClassName('preenche');
    var cont=0;

    //verificar se estão preenchidos
    for(i=0;i<myEl.length; i++){
      if($(myEl[i]).val().length!=0){
        cont++;
      }
    }
    //se todos estão preenchidos, então hbilita o botão de submeter.
    if(cont == myEl.length ){
      //habilitar o botão de submeter
      document.getElementById("subList").disabled = false;

    }
    else{
      //senão desabilitar o botão de submeter
      document.getElementById("subList").disabled = true;
    }
  },

  //Função para devolver uma lista de Palavras
  getPalavras: function(texto,nColuna){
    var self=this;
    var listaPalavras= new Array();
    var palavra='';

    var isCaracter=false;
    for(i=0;i<texto.length;i++){
      //de acordo com a tabela ascii 1º caracter possivel '!' CODE 33
      if(texto.charCodeAt(i)<33){
        //se o caracter anterior for válido
        if(isCaracter){
          //enterga a palavra à lista
          listaPalavras.push(palavra);
          //limpa a palavra
          palavra='';
          //não e um caracter válido (ex: "enter", "space", "tab")
          isCaracter=false;
        }
      }
      else{
        //adiciona o caracter à palavra
        palavra+=texto.charAt(i);
        //confirma que era uma caracter
        isCaracter=true;
      }
    }

    //entregar o resto
    if(palavra.length>0){
      listaPalavras.push(palavra);
    }

    var oHtml= '<span class="badge btn-success">Coluna '+nColuna+'</span>';
    for (var i = 0; i < listaPalavras.length; i++) {
      oHtml += '<br>'+listaPalavras[i];
    }

    return oHtml;
  },



});
