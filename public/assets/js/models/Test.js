// Teste:

var Test = Backbone.Model.extend({
  initialize: function (options) {
    this.id = options.id;
  },
  fetch: function (after_fetch) {
    var self = this;

    modem('GET', 'tests/' + this.id,
      function (json) {
        self.set("testeTexto", json.pergunta);
        self.set("titulo", json.titulo);
        self.set("texto", json.texto);
        self.set("disciplina", json.titulo);
        self.set("professorId", json.professorId);
        
        
    // necessário enviar o tipo de teste para a tabela, 'tipoTeste': 'texto'

        after_fetch();
      },
      function (xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        error_launch(json.message);
      }
    );
  }
});