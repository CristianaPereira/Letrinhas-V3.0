window.StudentsView = Backbone.View.extend({
    events: {
        "click #newstudentbtn": "newStudent",
        "click .studentSelec": "studentInfo",
        "click #editbtn": "editStudent",
        "click #deletebtn": "deleteStudent",
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Edit Student Navigation
    editStudent: function(e){
        e.preventDefault();
        app.navigate('students/' + e.target.value, true);
    },

    //Delete Student
    deleteStudent: function(e){
        e.preventDefault();

        var r = confirm("Are you sure you want to delete this student?");

        if(r){

            modem('POST', 'students/' + e.target.value + '/remove' ,

                //Response Handler
                function () {
                    document.location.reload(true);
                },

                //Error Handling
                function (xhr, ajaxOptions, thrownError) {

                }
            );

        }
    },

    //Fill School Preview
    fillPreview: function (json) {
        //Update Edit/Delete Button Values
        $("#studentsPreview #editbtn").val(json._id);
        $("#studentsPreview #deletebtn").val(json._id);

        //Set School Image
        $("#studentsPreview img").attr("src", json.b64);

        //Set School Name
        $("#studentsPreview #studentName").attr("value", json._id).html(json.nome);

        //Set School Address
        $("#studentsPreview #studentNumber").html(json.numero);

        //Set School ID
        $("#studentsPreview #studentClass").html(json.turma);

    },

    //Change Student Info
    studentInfo: function (e) {

        var self = this;

        //Get School Info
        modem('GET', 'students/' + e.target.id,

            //Response Handler
            function (json) {
                self.fillPreview(json);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

    },

    //New Student Navigation
    newStudent: function(e){
        e.preventDefault();
        app.navigate('/students/new', true);
    },

    //Class Initializer
    initialize: function () {
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if(!self.auth()){ return false; }

        //Render Template
        $(this.el).html(this.template());

        //Get Shools Information
        modem('GET', 'students',

            //Response Handler
            function (json) {

                //StudentsCounter
                $("#studentsBadge").text(json.length);

                //Append School Buttons To Template
                $("#studentsContent").empty();
                $.each(json, function (i) {

                    //Load First School Preview
                    if (i === 0) {
                        self.fillPreview(this.doc);
                    }

                    var $div = $("<button>", {
                        id: this.doc._id,
                        class: "btn btn-lg btn-block studentSelec",
                        name: this.doc.nome,
                        type: "button",
                        style: "height:60px; text-align:left; background-color: #53BDDC; color: #ffffff;"
                    })
                        .append("<img style='height:30px;' src='" + this.doc.b64 + "'>" + "&nbsp;&nbsp;&nbsp;" + this.doc.nome);

                    $("#studentsContent").append($div);
                });


            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

        return this;
    },

});
