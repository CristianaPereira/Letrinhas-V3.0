window.Inicio = Backbone.View.extend({

  events: {
    "click #irSite":"irsite",
    "click #app":"app",
    "click #buttonEntrar":"buttonEntrar",
    "click #cena":"teste",
    "keypress .form-control": "keyApaga",
    "click .btn-info":"fezDownload",
  },

  fezDownload:function(){
    $("#mApp").modal("hide");

  },

  app:function(e){
    var self=this;

    //se já estiver logado, então não pára aqui, e passa para o menuPrincipal
    var controlo=window.localStorage.getItem("Logged");
    if(controlo){
      $("#mApp").modal("show");
    }else{
      self.item="app";
      $("#mLogin").modal("show");
    }

  },

  irsite:function(e){
    var self=this;
    //se já estiver logado, então não pára aqui, e passa para o menuPrincipal
    var controlo = window.localStorage.getItem("Logged");
    if(controlo){
      //Segue para o Menu Principal.
      app.navigate('/MenuPrincipal', {
          trigger: true
        });
    }else{
      self.item="site";
      $("#mLogin").modal("show");
    }

  },

  keyApaga: function(e){
    $('#spEmail').attr("style","visibility:hidden");
    $('#spEmail').text("e");
    $('#spPsswd').attr("style","visibility:hidden");
    $('#spPsswd').text("e");

  },

  buttonEntrar: function (e) {
    e.preventDefault();
    var self = this;
    //verificar se input email está vazio
    if($('#userEmail').val().length==0){
      $('#spEmail').text("Este campo deve ser preenchido.");
      $('#spEmail').attr("style","visibility:initial");
      $('#spPsswd').attr("style","visibility:hidden");
      $("#userEmail").focus();
      $("#psswrd").val("");
    }
    else{

        //verificar primeiro se passwd está preenchida
        if($('#psswrd').val().length==0){
          $('#spEmail').attr("style","visibility:hidden");
          $('#spPsswd').text("Este campo deve ser preenchido.");
          $('#spPsswd').attr("style","visibility:initial");
          $("#psswrd").focus();
        }
        else{
          var cre = $('#userEmail').val() + ':' + $("#psswrd").val();
          var creb = btoa(cre);
          window.sessionStorage.setItem("keyo", creb);

          modem('GET', 'teachers', function(json) {
            console.log(json);
          });

          //1º Buscar o professor pelo e-mail
          modem('GET', 'teachers/' + $('#userEmail').val(),
              function (json) {
                // vamos comparar as password's
                if(json.password == $("#psswrd").val()){
                  //verificar o estado
                  if(json.estado==1 || json.estado=='Ativo'){
                    window.localStorage.setItem("Logged", true);
                    window.localStorage.setItem("Role", json.tipoFuncionario);
                    window.localStorage.setItem("ProfID", json._id); //guardar variavel
                    $("#mLogin").modal("hide");
                    switch (self.item) {
                      case 'site':
                        //Segue para o Menu Principal.
                        app.navigate('/MenuPrincipal', {
                            trigger: true
                          });

                        break;
                      case 'app':
                        $("#mApp").modal("show");
                        break;
                      default:

                    }

                  }
                  else{
                    $('#spEmail').attr("style","visibility:hidden");
                    $('#spPsswd').text("Já não tem permissão de acesso a este serviço.");
                    $('#spPsswd').attr("style","visibility:initial");
                    $("#psswrd").val("");
                    $("#psswrd").focus();
                  }


                }
                else{
                  $('#spEmail').attr("style","visibility:hidden");
                  $('#spPsswd').text("A password que inseriu está incorrecta.");
                  $('#spPsswd').attr("style","visibility:initial");
                  $("#psswrd").val("");
                  $("#psswrd").focus();
                }

              },

              function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);
                console.log("\nresposta:\n")
                console.log(json.message.error);
                console.log(json.result);
                //###################################
                // se notFound, então
                //  o email introduzido não existe na BD */
                if(json.message.error == 'not_found'){

                  $('#spEmail').text("O e-mail de utilizador que inseriu está incorrecto \n"
                                    +"ou não existe na Base de Dados");
                }else{
                  $('#spEmail').text("Ocorreu um erro a aceder à Base de Dados. Tente mais tarde.");
                }
                $('#spPsswd').attr("style","visibility:hidden");
                $('#spEmail').attr("style","visibility:initial");
                $("#userEmail").val("");
                $("#userEmail").focus();
                $("#psswrd").val("");
              }
            );

        }
      }

      return false;
    },


  goWebService:function(e){
    e.preventDefault();
    app.navigate("/login", {
      trigger: true
    });
    return null;
  },
  initialize: function() {},

  render: function() {
    var self=this;


    $(this.el).html(this.template());


    return this;
  }
});
