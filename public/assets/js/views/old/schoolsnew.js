window.SchoolsNew = Backbone.View.extend({
  events: {
    "click #buttonCancelar": "buttonCancelarEscola",
    "change #inputFoto": "carregFoto",
    "change .preenche":"verificarCampos",
    "focus .preenche":"disabelSub",
    "click #createTurma":"showTurmaForm",
    "click #addTurma":"newTurma",
    "click #cancelTurma":"hideTurmaForm",
    "keyup #InputNomeTurma": "confirmNameTurma",

  },

  confirmNameTurma: function(){
    if($("#InputNomeTurma").val().length > 0){
      $("#addTurma").attr("disabled",false);
    }
    else{
      $("#addTurma").attr("disabled",true);
    }
  },

  newTurma:function(){
    var self=this;
    var myEl = document.getElementById('selectAno');
    var indx = myEl.selectedIndex;

    // primeiro verifica se o nome e ano da turma já existem
    for(i=0; i < $("#nTurmas").val(); i++){

      if( $('#anoTrm'+(i+1)).val()== myEl.options[indx].value
        && $('#trm'+(i+1)).val()== $("#InputNomeTurma").val()){
          alert("A denominação da turma que está a inserir, já foi inserida nesse ano de escolaridade. \nPor favor tente novamente.");
          $("#InputNomeTurma").val('');
          $("#InputNomeTurma").focus();
          $("#addTurma").attr("disabled",true);
          return null;
        }
    }

    var turmaAno= myEl.options[indx].text+', '+$("#InputNomeTurma").val();

    var i = $("#nTurmas").val();
    i++;
    $("#nTurmas").val(i);
    var d = '<input type="text" id="anoTrm'+i+'" class="form-control " name="anoturm'+i+'">'
            +'<input type="text" id="trm'+i+'" class="form-control" name="nomTurm'+i+'">';
    $("#hiddenListaTurmas").append(d);

    var s = '<div id="d'+i+'"><br><label id="lb'+i+'">'+turmaAno+'</label>'
            +'<a id="bt'+i+'" class="glyphicon glyphicon-trash" align="right" style="width:30px; color:#dd0000"></a>';

    $("#listaTurmas").append(s);


    d= '#anoTrm'+i;
    $(d).val(myEl.options[indx].value);

    d= '#trm'+i;
    $(d).val($("#InputNomeTurma").val());


    //evento de apagar a turma adicionada:
    myEl = document.getElementById('bt'+i);
    myEl.addEventListener('click', function() {
      $("#d"+i).remove();
      //ano e turma vazios, não os posso eliminar, pois terei problemas a identificar os elementos..
      d= '#anoTrm'+i;
      $(d).val('');
      d= '#trm'+i;
      $(d).val('');


    }, false);

    self.hideTurmaForm();
  },

  hideTurmaForm:function(){
    var self=this;
    $("#InputNomeTurma").val('');
    document.getElementById('selectAno').selectedIndex=0;
    $("#createTurma").attr("style","display:show");
    $("#checkTurma").attr("style","display:none");
    $("#formTurma").attr("style","display:none");
    self.verificarCampos();
  },

  showTurmaForm:function(){
    $("#createTurma").attr("style","display:none");
    $("#checkTurma").attr("style","display:show");
    $("#formTurma").attr("style","display:show");
    $("#addTurma").attr("disabled",true);
    document.getElementById("subEscola").disabled = true;

  },


  initialize: function() {
    var self=this;

    $("#nTurmas").val(0);


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
      document.getElementById("subEscola").disabled = false;
    }
    else{
      //senão desabilitar o botão de submeter
      document.getElementById("subEscola").disabled = true;
    }
  },

  carregFoto:function(e){
    var self=this;
    if($("#inputFoto").val().length >0 ){
      var tmppath = URL.createObjectURL(e.target.files[0]);
      $("#iFoto").attr("src",tmppath);
      $("#iFoto").attr("style"," width:230px; display:show");

    }
    else{
      $("#iFoto").attr("style","display:none");
    }
  },

  buttonCancelarEscola: function(e) {
    e.preventDefault();
    window.history.back();
  },

  render: function() {
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
    //se não é administrador, volta para menuprincipal
    if( role != "Administrador do Sistema"){
        app.navigate('/#', {
          trigger: true
        });
        return null;
    }


    return this;
  }
});
