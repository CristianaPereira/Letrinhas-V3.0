window.StudentsEdit = Backbone.View.extend({
  events: {
      "click #buttonCancelar": "buttonCancelar",



  },
  initialize: function() {},

    buttonCancelar: function(e) {
    app.navigate('/MenuPrincipal', {
        trigger: true
      });
    },
  render: function() {
    $(this.el).html(this.template());
    return this;
  }
});
