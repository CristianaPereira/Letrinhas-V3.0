var Student = Backbone.Model.extend({
    urlRoot: 'students',
    defaults: {},
    initialize: function (options) {

    },
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'students/' + this.id,
            function (json) {
                self.attributes = (json);
                console.log(self)
                after_fetch();
            },
            //Precisamos enviar para a Tabela escolas o id do professor.
            function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);
                error_launch(json.message);
            }
        );
    },
    exist: function (username, after_fetch) {
        var self = this;
        //Generate Form Data
        var fd = new FormData();
        //puts username fields
        fd.append("username", username);
        //sends id
        modem('POST', 'students/exist',
            function (response) {
                after_fetch(response);
            },
            //Precisamos enviar para a Tabela escolas o id do professor.
            function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);
                console.log(xhr)
                console.log(ajaxOptions)
                console.log(thrownError)
            },
            fd
        );
    }
});

var Students = Backbone.Collection.extend({
    model: Student,
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'students',
            function (json) {
                console.log(json)
                for (i = 0; i < json.length; i++) {
                    self.models.push(new Student(json[i].doc));
                }
                after_fetch();
            },
            function () {
            }
        );
    },
    //Gets specific item from collection
    getByID: function (id) {
        var self = this;
        return (
            self.models.find(function (model) {
                return model.get('_id') === id;
            }).attributes
        )
    }
});