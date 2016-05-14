var School = Backbone.Model.extend({
    initialize: function (options) {
        this.id = options.id;
    },
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'schools/' + this.id,
            function (json) {
                self.set("name", json.name);
                self.set("id", json._id);
                self.set("address", json.address);
                self.set("b64", json.b64);
                json.classes.sort(sortJsonByCol('ano'));
                self.set("classes", json.classes);
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
