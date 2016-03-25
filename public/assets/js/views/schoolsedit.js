window.SchoolsEdit = Backbone.View.extend({
  events: {"click #buttonCancelar": "buttonCancelar",



  },
  initialize: function() {},

  buttonCancelar: function(e) {
  app.navigate('/MenuPrincipal', {
      trigger: true
    });
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
