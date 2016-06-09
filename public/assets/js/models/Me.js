var Me = Backbone.Model.extend({
    initialize: function () {

    },
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'me', function (teacherData) {
            self.attributes = teacherData;
            self.set("permissionLevel", getUserRole(teacherData.permissionLevel));

            after_fetch();
        }, function (error) {
            console.log('Error getting my data!');
            var json = JSON.parse(xhr.responseText);
            error_launch(json.message);
        });
    }
});
