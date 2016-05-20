var Category = Backbone.Model.extend({
    urlRoot: 'categories',
    defaults: {},
    initialize: function () {
    },

    fetch: function (after_fetch) {
        var self = this;

        modem('GET', 'categories/' + this.id,
            //Response Handler
            function (json) {
                self.attributes = json;
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

var Categories = Backbone.Collection.extend({
    model: Category,
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'categories',
            function (json) {
                //   json.sort(sortJsonByCol('id'));
                for (i = 0; i < json.length; i++) {

                    self.models.push(new Category(json[i].doc));
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