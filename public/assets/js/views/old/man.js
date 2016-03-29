window.manView = Backbone.View.extend({
  events:{
    "click #manSair": "Logout",
  },
  initialize: function () {
  },

  Logout:function(e){
    e.preventDefault();
    window.history.back();

  },
  render: function () {
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

    return this;
  }

});
