

window.MenuPrincipalView = Backbone.View.extend({
  events:{
    "click #menuSair": "Logout",
  },

  initialize: function () {
    var self=this;
  },

  Logout:function(e){
    e.preventDefault();
    window.localStorage.removeItem("Logged");
    window.localStorage.removeItem("ProfID");
    window.localStorage.removeItem("Roll");
    window.history.back();
    app.navigate('/#', {
        trigger: true
      });
      return null;
  },

  render: function () {
    $(this.el).html(this.template());

    //verificar se está logado
    var controlo=window.localStorage.getItem("Logged");
    if(!controlo){
      console.log('Não Logado aqui');
      app.navigate('/#', {
          trigger: true
        });
        return null;
    }
    var role = ''+window.localStorage.getItem('Role');
    //criar restrições a opções consoante as permissões do utiizador.
    if(role == "Administrador do Sistema"){
      setTimeout(function(){
        $("#opDef").attr("style","display:show");
        $("#sepProf").attr("style","display:show");
      },1);

    }
    modem('GET', 'teachers/'+window.localStorage.getItem("ProfID"), function(data) {
      $("#user").text(data.nome);
    }, function(error) {
      console.log('Error getting user '+window.localStorage.getItem("ProfID"));
    });

    return this;
  },

});
