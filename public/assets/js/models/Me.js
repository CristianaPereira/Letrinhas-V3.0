var Me = Backbone.Model.extend({
    initialize: function () {

    },
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'me', function (teacherData) {
            self.attributes = teacherData;
            self.set("permissionLevel", getUserRole(teacherData.permissionLevel));

            after_fetch();
        }, function (xhr, ajaxOptions, thrownError) {
            /* var json = JSON.parse(xhr.responseText);
             failMsg($("body"), json.text);
             setTimeout(function () {
             app.navigate('/home', {
             trigger: true
             });
             }, json.text.length * 50);*/
        });
    }
});
