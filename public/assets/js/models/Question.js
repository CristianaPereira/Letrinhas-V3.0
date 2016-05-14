/**
 * Created by Cris on 11/05/2016.
 */
var Question = Backbone.Model.extend({
    urlRoot: 'questions',
    defaults: {
        "state": true,
        "type": "text"
    },
    initialize: function (options) {
        console.log(options)
        this.id = options.id;
        this.bd2 = 'dev_perguntas';
        this.site = 'http://127.0.0.1:5984';//process.env.COUCHDB;

    },

    fetch: function (after_fetch) {
        var self = this;

        modem('GET', 'questions/' + this.id,

            //Response Handler
            function (json) {
                console.log(json);
                self.set("title", json.title);
                self.set("description", json.description);
                self.set("question", json.question);
                self.set("contentText", json.content.text);
                self.set("subject", json.subject);
                self.set("voice", self.site + "/" + self.bd2 + "/" + json._id + "/voice.mp3");
                after_fetch();
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);
                error_launch(json.message);
            }
        );
    },
    fetchAll: function (after_fetch) {
        var self = this;

        modem('GET', 'questions',

            //Response Handler
            function (json) {
                console.log(json);
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

