// Teste:

var Test = Backbone.Model.extend({
    defaults: {
        title: 'Some title',
        description: 'Some title',
        year: 0,
        questions: [],
        subject: "",
        content: "",
        specification: "",
    },
    urlRoot: 'tests',
    initialize: function (options) {
        this.id = options.id;
    },
    fetch: function (after_fetch) {
        var self = this;

        modem('GET', 'tests/' + this.id,
            function (json) {
                self.attributes = (json);
                after_fetch();
            },
            function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);
                error_launch(json.message);
            }
        );
    }
});

var Tests = Backbone.Collection.extend({
    model: Test,
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'tests',
            function (json) {
                for (i = 0; i < json.length; i++) {
                    self.models.push(new Test(json[i].doc));
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