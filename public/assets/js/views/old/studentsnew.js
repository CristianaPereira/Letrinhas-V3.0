window.StudentsNewView = Backbone.View.extend({
    events: {
        "click #buttonCancelar": "buttonCancelarAluno",
        "change #inputFoto": "carregFoto",
        "change .preenche":"verificarCampos",
        "focus .preenche":"disabelSub",

    },

    disabelSub: function(){
     document.getElementById("subProf").disabled = true;
    },

  initialize: function () {var self=this;

  },



    buttonCancelarAluno: function (e) {
        e.preventDefault();
        window.history.back();
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
        document.getElementById("subAluno").disabled = false;
      }
      else{
        //senão desabilitar o botão de submeter
        document.getElementById("subAluno").disabled = true;
      }
    },

    carregFoto:function(e){
      var self=this;
      if($("#inputFoto").val().length >0 ){
        var tmppath = URL.createObjectURL(e.target.files[0]);
        $("#iFoto").attr("src",tmppath);
        $("#iFoto").attr("style"," width:200px; display:show");

      }
      else{
        $("#iFoto").attr("style","display:none");
      }
    },


    render: function () {
        var self = this;
        $(this.el).html(this.template());


        modem('GET', 'schools',
            function (json) {
              // Preencher o select escola, com as escolas existentes e respetivas turmas:
              //e o select que vai ajudar a devolver os ID's ao form e fazer a correta atualização na escola
              var s='<option value=""></option>';
              var d='<option value=""></option>';
              for(i=0; i<json.length; i++){
                s+='<optgroup label="'+ json[i].doc.nome+'">';
                //e adicionar as turmas...

                for(j=0;j<json[i].doc.turmas.length;j++){
                  s+='<option value="'+json[i].doc.nome+'">'+json[i].doc.turmas[j].ano
                  +'º, '+json[i].doc.turmas[j].nome+'</option>';
                  d+='<option value="'+json[i].doc._id+'">'+json[i].doc.turmas[j]._id+'</option>';
                }
                s+="</optgroup>";
              }
              $("#selectTurma").html(s);
              $("#hidenTurma").html(d);
              //no hidden, contém no value o id da escola
              //e no text o id da turma.

              //adicionar os eventos para o select da turma.
              var myEl = document.getElementById('selectTurma');
              myEl.addEventListener('change', function() {
                var i = this.selectedIndex;
                //igualar os indexes
                var hidden = document.getElementById('hidenTurma');
                hidden.selectedIndex = i;
                //addicionar os id's necessários de escola:turma;
                var r=hidden.options[i].value+':'+hidden.options[i].text+';';
                $("#hidenIDTurma").val(r);

              }, false);

            },

            function (xhr, ajaxOptions, throwError) {
                var json = JSON.parse(xhr.responseText);
                console.log("\Erro");
                console.log(json.message.error);
                console.log(json.result);
            });
        return this;
    },


});
