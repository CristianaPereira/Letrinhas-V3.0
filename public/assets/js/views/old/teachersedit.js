window.TeachersEditView = Backbone.View.extend({
  events: {
    "click #buttonCancelar": "buttonCancelar",
    "click .edita":"habilitaEdicao",
    "submit":"submitEdition",
    "change #inputFoto": "carregaFoto",
    "mouseover #pwdIcon":"verPwd",
    "mouseout #pwdIcon":"escondePwd",
    "keyup #ConfirmPasswd": "confirmPwd",


  },

  confirmPwd:function(){
    if($("#InputPasswd").val()==$("#ConfirmPasswd").val()){
      $("#confIcon").addClass("glyphicon-ok");
      $("#confIcon").removeClass("glyphicon-remove");
      $("#confIcon").attr("style","color:#66dd66");
    }
    else{
      $("#confIcon").addClass("glyphicon-remove");
      $("#confIcon").removeClass("glyphicon-ok");
      $("#confIcon").attr("style","color:#dd6666");

    }
  },

  escondePwd:function(){
    $("#pwdIcon").attr("style","color:#cccccc");
    $("#InputPasswd").attr("type","password");
  },

  verPwd:function(){
    $("#pwdIcon").attr("style","color:#66cc66");
    $("#InputPasswd").attr("type","text");

  },

  buttonCancelar: function(e) {
    e.preventDefault();
    window.sessionStorage.removeItem("ProfEditar");
    window.history.back();
  },


  habilitaEdicao:function(e){
    var self=this;
      if($("#"+$(e.toElement).attr('value')).attr('disabled')){
        var myEl = document.getElementsByClassName("edita");
        //esconder todos os outros botões de edição.
        for(i=0; i< myEl.length;i++){
          if(myEl[i].value != $(e.toElement).attr('value')){
            $(myEl[i]).attr('style','visibility:hidden');
          }

        }
        if( $(e.toElement).attr('value') != "selectTipo" &&
            $(e.toElement).attr('value') != "selectEstado"){
                      self.valor = $("#"+$(e.toElement).attr('value')).val();
                      $("#"+$(e.toElement).attr('value')).val('');
        }
        $("#"+$(e.toElement).attr('value')).attr('disabled',false);
        $(e.toElement).removeClass("glyphicon-edit");
        $(e.toElement).removeClass("btn-warning");
        $(e.toElement).addClass("glyphicon-ok");
        $(e.toElement).addClass("btn-success");
        $(e.toElement).attr('style','');
        $("#subEdProf").attr("disabled",true);

        if($(e.toElement).attr('value') == "InputPasswd"){
          $("#pwdIcon").attr("style","display:show; color:#cccccc");
          $("#ConfirmPasswd").attr('disabled',false);
        }
      }
      else{
        try{

          if($("#"+$(e.toElement).attr('value')).val().length == 0){
            //$("#subEdProf").attr("disabled",true);
            self.alterado=false;
            $("#"+$(e.toElement).attr('value')).val(self.valor);
          }
          else{
            if($("#"+$(e.toElement).attr('value')).val() == self.valor){
              //$("#subEdProf").attr("disabled",true);
              self.alterado=false;
            }
            else{
              self.alterado=true;
            }
          }
        }
        catch(e){
          self.alterado=false;
          console.log("algum erro em :" + $(e.toElement).attr('value') );
          console.log(e);
        };

        if(self.alterado && $(e.toElement).attr('value') == "InputPasswd"){
          if($("#ConfirmPasswd").val() != $("#InputPasswd").val()){
            $("#subEdProf").attr("disabled",true);
            alert("A Password e a sua confirmção não correspondem, por favor confirme a nova password");
            return 0;
          }
        }

        $("#"+$(e.toElement).attr('value')).attr('disabled',true);
        $(e.toElement).removeClass("glyphicon-ok");
        $(e.toElement).removeClass("btn-success");
        $(e.toElement).addClass("glyphicon-edit");
        $(e.toElement).addClass("btn-warning");
        $("#pwdIcon").attr("style","display:none");
        $("#ConfirmPasswd").attr('disabled',true);
        //habilitar o botão de submeter.
        $("#subEdProf").attr("disabled",false);

        var myEl = document.getElementsByClassName("edita");
        //mostrar todos os outros botões de edição.
        for(i=0; i< myEl.length;i++){
          if(myEl[i].value != $(e.toElement).attr('value')){
            $(myEl[i]).attr('style','');
          }

        }
      }

  },

  carregaFoto:function(e){
    var self=this;
    if($("#inputFoto").val().length >0 ){
      var tmppath = URL.createObjectURL(e.target.files[0]);
      //$("#iFoto").attr("src",tmppath);
      //$("#iFoto").attr("style"," width:300px; display:show");
      alert("asd");
    }
    else{
      $("#iFoto").attr("style","display:none");
      $("#iFoto").attr("src",'');

    }
  },

  submitEdition:function(e){
    var self=this;
    if(self.alterado){
      var myElements = document.getElementsByClassName('preenche');
      //re-habilitar os input's para que passem no form..
      for(i=0; i<myElements.length; i++){
        $(myElements[i]).attr("disabled",false);
      }

      //mudar a ação para o professor a editar
      e.target.action="/teachers/"+window.sessionStorage.getItem("ProfEditar");
      window.sessionStorage.removeItem("ProfEditar");
    }

  },

  initialize: function() {
    var self=this;
    self.bd='dev_professores';
    self.site='http://185.15.22.235:5984';

  },

  render: function() {
    var self = this;

    $(this.el).html(this.template());

    setTimeout(function(){
      //esconder campos sensíveis do user, só o admin pode alterar.
      if(role != "Administrador do Sistema"){
        $("#panelEstado").attr("style","display:none");
        $("#panelTipo").attr("style","display:none");
      }
    },1);



    modem('GET', 'teachers/'+window.sessionStorage.getItem("ProfEditar"), function(professor) {
      self.nome=professor.nome;
      self.eMail = professor._id;
      self.estado = professor.estado;
      self.pwd = professor.password;
      self.pin = professor.pin;
      self.telefone = professor.telefone;
      self.tipoFunc = professor.tipoFuncionario;
      $("#InputNome").val(self.nome);
      $("#editHead").html('<img src="../img/letrinhas2.png" style="height:40px">'
                         +'<img src="../img/docentes.png"  style="height:40px;" >'
                         +"Editar dados de "+self.eMail);
      $("#InputEmail").val(self.eMail);
      $("#InputPasswd").val(self.pwd);
      $("#inputPin").val(self.pin);
      $("#InputTelefone").val(self.telefone);
      $("#iFoto").attr('src','photo/'+self.bd+'/'+window.localStorage.getItem("ProfID")+'/prof.jpg');

      switch (professor.tipoFuncionario) {
        case "Administrador do Sistema":
            document.getElementById('selectTipo').selectedIndex=0;
          break;
        case "Professor":
            document.getElementById('selectTipo').selectedIndex=1;
          break;
        case "Auxiliar":
            document.getElementById('selectTipo').selectedIndex=2;
          break;
      }

      if(professor.estado){
        document.getElementById('selectEstado').selectedIndex=0;
      }
      else{
        document.getElementById('selectEstado').selectedIndex=1;
      }

    }, function(error) {
      console.log('Error getting teacher list!');
    });



    return this;
  }
});
