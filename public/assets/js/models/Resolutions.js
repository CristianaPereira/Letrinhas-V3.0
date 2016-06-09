var Resolution = Backbone.Model.extend({
        urlRoot: 'resolutions',
        defaults: {},
        initialize: function () {
            this.site = "http://127.0.0.1:5984";
        },
        fetch: function (after_fetch) {
            var self = this;
            modem('GET', 'resolutions/' + this.id,
                function (json) {
                    console.log(json)
                    self.attributes = (json);
                    self.attributes.resolutionDate = self.attributes.resolutionDate.substring(0, 10);
                    self.attributes.audioStudent = self.site + "/let_resolutions/" + json._id + "/record.mpeg";
                    self.attributes.audioProf = self.site + "/let_questions/" + json.questionID + "/voice.mp3";

                    after_fetch();
                },
                //Precisamos enviar para a Tabela escolas o id do professor.
                function (xhr, ajaxOptions, thrownError) {
                    var json = JSON.parse(xhr.responseText);
                    error_launch(json.message);
                }
            );
        }
    })
    ;

var Resolutions = Backbone.Collection.extend({
    model: Resolution,
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'resolutions',
            function (json) {
                for (i = 0; i < json.length; i++) {
                    json[i].resolutionDate = json[i].resolutionDate.substring(0, 10);
                    self.models.push(new Resolution(json[i]));
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