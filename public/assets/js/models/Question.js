var Question = Backbone.Model.extend({
    urlRoot: 'questions',
    defaults: {},
    initialize: function (options) {
        this.id = options.id;
        this.site = "http://127.0.0.1:5984";
        this.bd = "let_questions";
    },

    fetch: function (after_fetch) {
        var self = this;

        modem('GET', 'questions/' + this.id,
            //Response Handler
            function (json) {
                self.attributes = json;
                self.set("voice", self.site + "/" + self.bd + "/" + json._id + "/voice.mp3");
                after_fetch();
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);
                error_launch(json.message);
            }
        );

    }
});

var Questions = Backbone.Collection.extend({
    model: Question,
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'questions',
            function (json) {
                //   json.sort(sortJsonByCol('id'));
                for (i = 0; i < json.length; i++) {

                    self.models.push(new Question(json[i].doc));
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