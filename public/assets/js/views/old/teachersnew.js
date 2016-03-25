window.TeachersNewView = Backbone.View.extend({
  events: {
    "click #buttonCancelar": "buttonCancelar",
    "change .preenche":"verificarCampos",
    "change #InputEmail":"verificarMail",
    "click #addTurma": "addTurma",
    "click #limpaTurmas":"limpaTurmas",
    "mouseover #pwdIcon":"verPwd",
    "mouseout #pwdIcon":"escondePwd",
    "keyup #ConfirmPasswd": "confirmPwd",
    "focus #InputPasswd":"limpapwds",
    "change #inputFoto": "carregFoto",


  },

  //Martelada à Bruta... Mas funciona.
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
      document.getElementById("subProf").disabled = false;
      //adicioinar parametros invisíveis ao form, para tratamento na inserção
      var input = $("<input>").attr("type", "hidden")
          .attr("name", "profID")
          .val(window.localStorage.getItem("ProfID"));
      $('#txtNewForm').append($(input));
    }
    else{
      //senão desabilitar o botão de submeter
      document.getElementById("subProf").disabled = true;
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

  limpaTurmas: function(){
    $("#limpaTurmas").attr("style","display:none");
    //limpa as turmas escolhidas
    $("#assocTurma").html('');
    //limpa os ids.
    $("#teacherClasses").val('');
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

  limpapwds:function(){
    $("#ConfirmPasswd").val('');
    $("#InputPasswd").val('');
    $("#confIcon").removeClass("glyphicon-ok");
    $("#confIcon").removeClass("glyphicon-remove");
  },

  escondePwd:function(){
    $("#pwdIcon").attr("style","color:#cccccc");
    $("#InputPasswd").attr("type","password");
  },
  verPwd:function(){
    $("#pwdIcon").attr("style","color:#66cc66");
    $("#InputPasswd").attr("type","text");

  },
  initialize: function() {
    var self=this;
    //Obtem as escolas registadas
    modem('GET', 'schools',
        function (json) {
          var schoolsList='<select class="form-control" id="dbEscolas">';
          schoolsList+='<option disabled selected>Escola</option>';
          var classList='<select class="form-control" id="dbTurmas">';
          classList+='<option disabled selected>Turma</option>';
          //Lista as escolas
          for(i=0; i<json.length; i++){
            schoolsList+='<option id="'+json[i].doc._id+'">'+json[i].doc.nome+'</option>';
          }
          //Lista as turmas da primeira escola
          for(j=0;j<json[0].doc.turmas.length;j++){
            classList+='<option id="'+json[0].doc.turmas[j]._id+'">'+json[0].doc.turmas[j].ano+'º'+json[0].doc.turmas[j].nome+'</option>';
          }
          schoolsList+="</select>";
          classList+="</select>";

          $("#selectEscolas").html(schoolsList);
          $("#selectTurmas").html(classList);

          var myEl = document.getElementById('dbEscolas');
          myEl.addEventListener('change', function() {
            var i = this.selectedIndex;
            var selectedSchool=$(this).children(":selected").attr("id");
            for(i=0; i<json.length; i++){
              if(json[i].doc._id === selectedSchool){
                classList='<select class="form-control" id="dbTurmas">';
                classList+='<option disabled selected>Turma</option>';
                for(j=0;j<json[i].doc.turmas.length;j++){
                  classList+='<option value="'+json[i].doc.turmas[j]._id+'">'+json[i].doc.turmas[j].ano+'º'+json[i].doc.turmas[j].nome+'</option>';
                }
              }
            }
            classList+="</select>";
            $("#selectTurmas").html(classList);
            $("#limpaTurmas").attr("style","display:show");
          }, false);
        },
        function (xhr, ajaxOptions, thrownError) {
          var json = JSON.parse(xhr.responseText);
          console.log("\nErro:\n")
          console.log(json.message.error);
          console.log(json.result);
        }
    );
  },

  verificarMail: function(){
    var self=this;
    document.getElementById("subProf").disabled = true;
    var mail = $("#InputEmail").val();
    var placeHolder = $("#InputEmail").attr("placeholder");
    $("#InputEmail").val('');
    $("#InputEmail").attr("placeholder",mail);
    $("#imgMail").attr("style","display:show");

    //Verificar se mail já existe na BD
    modem('GET', 'teachers/'+mail,
        function (json) {
          $("#lblMAil").attr("style","color:#ff0000");
          $("#lblMAil").text('Email: "'+mail+'" já consta na Base de Dados!');
          $("#InputEmail").attr("placeholder",placeHolder);
          $("#imgMail").attr("style","display:none");
        },
        function (xhr, ajaxOptions, thrownError) {
          var json = JSON.parse(xhr.responseText);
          console.log("\nErro:\n")
          console.log(json.message.error);
          console.log(json.result);
          $("#lblMAil").text('Email:');
          $("#lblMAil").attr("style","color:#000000");
          $("#InputEmail").val(mail);
          $("#InputEmail").attr("placeholder",placeHolder);
          $("#imgMail").attr("style","display:none");
          self.verificarCampos();
        }
    );
  },

  addTurma: function(){
    //addicionar os id's necessários de escola:turma;
    var r=$("#teacherClasses").val();
    r+=$("#dbEscolas").children(":selected").attr("id")+':'+$("#dbTurmas").children(":selected").attr("id")+';';
   $("#teacherClasses").val(r);
    //apresentar a turma escolhida
    var v='<label> - '+$("#dbTurmas").children(":selected").text()+'</label><span>, '
        +$("#dbEscolas").children(":selected").text()+'; </span><br>';
    $("#assocTurma").append(v);
  },

  buttonCancelar: function(e) {
    e.preventDefault();
    window.history.back();
  },

  render: function() {
    var sefl=this;

    //Se não está logado nem é administrador, sai daqui!
    var controlo=window.localStorage.getItem("Logged");
    var role = ''+window.localStorage.getItem('Role');
    if(!controlo || role != "Administrador do Sistema"){
      console.log('Não Logado');
      app.navigate('/#', {
        trigger: true
      });
      return null;
    }

    $(this.el).html(this.template());

    return this;
  }

});
