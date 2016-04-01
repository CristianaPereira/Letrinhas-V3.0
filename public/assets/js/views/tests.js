window.TestsView = Backbone.View.extend({
    events: {},

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },


    //Class Initializer
    initialize: function () {
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if(!self.auth()){ return false; }

        $(this.el).html(this.template());

        //Return Tests
        modem('GET', 'tests',

            //Response Handler
            function (json) {

                console.log(json);

                //Append Test Buttons To Template
                $("#testsContent").html("");
                $.each(json, function (i) {

                    //Load First School Preview
                    if (i === 0) {
                        //self.fillPreview(this.doc);
                    }

                    //Select Test Type Image
                    var imgT = '';
                    switch(this.doc.tipo){
                        case 'Texto': imgT="../img/testeTexto.png";
                            break;
                        case 'Lista': imgT="../img/testLista.png";
                            break;
                        case 'Multimédia': imgT="../img/testMul.png";
                            break;
                        case 'Interpretação': imgT="../img/testInterpretacao.png";
                            break;
                        default:  imgT="../img/page-loader.gif";
                            break;
                    };

                    //Select Test Class Image
                    var imgC = '';
                    switch(this.doc.disciplina){
                        case 'Português': imgC="../img/portugues.png";
                            break;
                        case 'Inglês': imgC="../img/ingles.png";
                            break;
                        case 'Matemática': imgC="../img/mate.png";
                            break;
                        case 'Estudo do Meio': imgC="../img/estudoMeio.png";
                            break;
                        case 'Outra língua': imgC="../img/outroLinguas2.png";
                            break;
                        case 'Outra': imgC="../img/outro.png";
                            break;
                        default:  imgC="../img/page-loader.gif";
                            break;
                    };

                    //Select BG Color
                    var color = "#53BDDC";
                    if(this.doc.isMine)
                        color = "#60CC60";

                    //Construct Button
                    var $div = $("<button>", {
                        id: this.doc._id,
                        class: "btn btn-lg btn-block testSelec",
                        name: this.doc.titulo,
                        type: "button",
                        style: "height:60px; text-align:left; background-color: " + color + "; color: #ffffff;"
                    })
                        .append(
                            "<img style='height:30px;' src='" + imgT + "'>" +
                            "<img style='height:30px;' src='" + imgC + "'>" +
                            "&nbsp;&nbsp;&nbsp;" +
                            this.doc.titulo
                        );

                    $("#testsContent").append($div);
                });
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#testsContent"), "Não foi possível listar os testes. \n (" + JSON.parse(xhr.responseText).error + ").");
            }
        );
        
        return this;
    }

});
