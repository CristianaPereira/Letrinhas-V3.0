var Teacher = Backbone.Model.extend({
  initialize: function (options) {
    this.id = options.id;
  },
  fetch: function (after_fetch) {
    var self = this;
    modem('GET', 'teachers/' + this.id,
      function (json) {
        self.set("nome", json.nome);
        self.set("telefone", json.telefone);
        self.set("password", json.password);
        self.set("pin", json.pin);
        self.set("estado",json.true);
          console.log("models/teacher");
        after_fetch();
      },
      //Precisamos enviar para a Tabela escolas o id do professor.
      function (xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        error_launch(json.message);
      }
    );
  }
});
