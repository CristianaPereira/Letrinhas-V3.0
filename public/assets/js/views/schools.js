window.SchoolsView = Backbone.View.extend({
    events: {
        "click .schoolSelec": "schoolInfo",
        "click #newschoolbtn": "newSchool",
        "click #editbtn": "editSchool",
        "click #deletebtn": "deleteSchool",
        "click #showSchoolDetails": "showSchoolDetails",
        "keyup #schoolSearch": "searchSchool",
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Change School Info
    schoolInfo: function (e) {

        var self = this;

        //Get School Info
        modem('GET', 'schools/' + e.target.id,

            //Response Handler
            function (json) {
                self.fillPreview(json);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

    },

    //Navigate To School Details
    showSchoolDetails: function (e) {
        e.preventDefault();
        app.navigate('schools/' + e.target.value, {
            trigger: true
        });
    },

    //Navigate To School Edit Page
    editSchool: function(e){
        e.preventDefault();
        app.navigate('schools/' + e.target.value + '/edit', {
            trigger: true
        });
    },

    //Fill School Preview
    fillPreview: function (json) {
        //Update Edit/Delete Button Values
        $("#schoolsPreview #editbtn").val(json._id);
        $("#schoolsPreview #deletebtn").val(json._id);

        //Set School Image
        $("#schoolsPreview img").attr("src", json.b64);

        //Set School Name
        $("#schoolsPreview #schoolName").attr("value", json._id).html(json.nome);

        //Set School Address
        $("#schoolsPreview #schoolAddress").html(json.morada);

        //Set School ID
        $("#showSchoolDetails").val(json._id);

        //Fill Class Info
        $("#schoolsPreview #classList").html("");
        if (json.turmas.length > 0) {

            $.each(json.turmas, function (i) {
                var $class = $('<div>', {class: "col-md-3"}).append(
                    $('<button>', {
                        id: "btnTurma" + i,
                        class: "btn btn-info mostraTurma",
                        value: this.id,
                        style: "font-size:11px"
                    })
                        .append(this.ano + "º Ano, " + this.nome)
                );

                $("#schoolsPreview #classList").append($class);

            });

        }
        else {
            //If School Has No Class
            $("#schoolsPreview #classList").append("<div class='col-md-12 alert-warning' align=center ><hr><label>Esta escola não tem turmas.</label></div>");
        }

    },

    //Go to new school template
    newSchool: function (e) {
        e.preventDefault();

        app.navigate('/schools/new', {
            trigger: true
        });
    },

    //Remove School
    deleteSchool: function(e){
        e.preventDefault();

        var r = confirm("Are you sure you want to delete this school?");

        if(r){

            modem('POST', 'schools/' + e.target.value + '/remove' ,

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

    //Search School
    searchSchool: function(e){

        $('#schoolsContent').find('button').each(function(){

            var search = new RegExp(($("#schoolSearch").val()).toLowerCase());
            var source = ($(this).attr('name')).toLowerCase();


            if(search.test(source)){
                $(this).show();
            }
            else{
                $(this).hide();
            }

        });

    },

    //Class Initializer
    initialize: function () {},

    //Class Renderer
    render: function () {

        var self = this;

        //Check Local Auth
        if(!self.auth()){ return false; }

        $(this.el).html(this.template());

        $("#opDef").attr("style", "display:show");
        $("#sepProf").attr("style", "display:show");


        //Get Shools Information
        modem('GET', 'schools',

            //Response Handler
            function (json) {

                //Append School Buttons To Template
                $("#schoolsContent").html("");
                $.each(json, function (i) {

                    //Load First School Preview
                    if (i === 0) {
                        self.fillPreview(this.doc);
                    }

                    var $div = $("<button>", {
                        id: this.doc._id,
                        class: "btn btn-lg btn-block schoolSelec",
                        name: this.doc.nome,
                        type: "button",
                        style: "height:60px; text-align:left; background-color: #53BDDC; color: #ffffff;"
                    })
                        .append("<img style='height:30px;' src='" + this.doc.b64 + "'>" + "&nbsp;&nbsp;&nbsp;" + this.doc.nome);

                    $("#schoolsContent").append($div);
                });


            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

        return this;

    }

});
