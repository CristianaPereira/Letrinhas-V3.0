window.TestsView = Backbone.View.extend({
    events: {
        'click .listButton': "fillPreview",
        'click .fa-calendar': "assocTeste",
        'click #btnAtrTest': "atrTeste",
        'click dropdown-submenu': "filterBy",
        'click .contentFilter': "filterBycontent",
        "keyup #txtSearch": "filterBy",
        "click #orderBy": "orderTests",
        "click .deleteTest": "confirmDelete",
        "click #deletebtn": "deleteTest",

    },

    //Exibe o modal com os campos necessarios para associar o teste
    assocTeste: function (e) {
        console.log($(e.currentTarget).attr("testID"));

        //Mostra o titulo do teste
        $("#attrTest h4").html("Atribuir teste: " + $(e.currentTarget).attr("testName"));
        $("#testID").val($(e.currentTarget).attr("testID"))
        // $("#testsPreview").clone().appendTo(".modal-body");
        //$("#mLogin  #myCarousel").attr("id", "atrTest");
        // $("#mLogin  a").attr("href", "#atrTest");
        $("#attrTest").modal("show");
    },
    //Applys filters
    filterBy: function () {
        var typedText = $("#txtSearch").val();

        //Esconde todos os testes
        $(".listButton").hide();
        //Mostra apenas os que contém a string escrita
        $(".listButton:containsi(" + typedText + ")").show();

        //Esconde os testes cujas checkboxes não estão seleccionadas
        $.each($("input:checkbox:not(:checked)"), function (i, k) {
            console.log($(k).attr("value"))
            $(".listButton[type=" + $(k).attr("value") + "]").hide();
        });

        //Esconde os que ao correspondem conteudos seleccionados
        $.each($(".listButton:visible"), function (i, k) {
            //Se nao pertencerem à categoria escolhida, esconde-os
            if ($(k).attr("value").indexOf($("#filterSubject").attr("filter")) == -1) {
                $(k).hide();
            }
        });
        $("#questionsBadge").text($(".listButton:visible").length + "/" + this.data.length)

    },

    //Applys filters
    filterBycontent: function (e) {
        var self = this;
        $("#filterSubject").attr("filter", $(e.target).attr("value"));
        self.filterBy();
    },

    //Atribui o teste ao aluno
    atrTeste: function (e) {
        e.preventDefault();

        //Se algum dos campos estiver vazio
        var allListElements = $(".mandatory");
        //Verifies if all inputs are OK
        var isValid = isFormValid(allListElements);
        if (isValid) {

            var testDetails = $('#attrTestForm').serializeObject();
            //Obtem os dados to teste generico
            var genericTest = this.collection.getByID(testDetails.genericID);
            //Cria um novo model com os dados do teste generico e os dados especificos
            var assocTest = new Test(testDetails)
            //envia o post
            assocTest.assocTest(genericTest);
        }
    },

    orderTests: function (e) {
        var mylist = $('#testsContent');

        orderContentList(mylist, e);
    },

    fillPreview: function (e) {
        //Se foi clicado no button e nao nos buttons da sopçoes
        if ($(e.target).hasClass("listButton")) {
            var self = this;
            //Recolhe a info do teste
            var test = this.collection.getByID($(e.currentTarget).attr("id"));

            //Recolhe a info de cada uma das perguntas do teste
            $(".carousel-indicators").empty();
            $("#myCarousel .carousel-inner").empty();
            $.each(test.questions, function (testKey, quest) {
                console.log(testKey)
                console.log(quest)
                //Adiciona o botao
                $(".carousel-indicators").append($('<li>', {
                    'data-target': '#myCarousel',
                    'data-slide-to': testKey
                }));


                var question = new Question({id: quest._id});
                question.fetch(function () {
                    //Adiciona o titulo
                    $("#previewModalTitle").text(test.title)
                    //Adiciona a div onde será apresentado o conteúdo
                    $("#myCarousel .carousel-inner").append($('<div>', {
                        class: 'item', html: quest.title, id: 'questionsPreview' + testKey
                    }));
                    //Exibe os dados do teste
                    self.enchePreview(question.attributes, testKey);
                    //Exibe a primeira pergunta do teste
                    $('#myCarousel .carousel-indicators li:first').addClass('active');
                    $('#myCarousel .carousel-inner > div:first').addClass('active');
                })

            });
        }


    },


    //Text Preview
    enchePreview: function (question, i) {
        //gets model info
        var self = this;
        //Clear Preview
        $("#questionsPreview" + i).empty();

        //Question Description
        $("#questionsPreview" + i)
            .append(
                $('<label>', {
                    class: "dataTitle col-md-12 row", text: question.title
                }).append("<hr>"),
                $('<div>', {
                    class: "form-group"
                }),
                $('<div>', {
                    class: "form-group"
                }).append(
                    $('<label>', {
                        class: "col-md-3 lblDataDetails", text: "Pergunta:"
                    }),
                    $('<label>', {
                        class: "col-md-9 ", text: question.question
                    })
                ),

                $('<div>', {
                    class: "col-md-12", id: "questionBox" + i
                })
            )
        ;

        switch (question.type) {
            case 'text':
                $("#questionsPreview" + i).append(getTextPreview(question))
                break;
            case 'list':
                $("#questionsPreview" + i).append(setListPreview(question))
                break;
            case 'interpretation':
                $("#questionsPreview" + i).append(setInterpretationPreview(question))
                break;
            case 'multimedia':
                $("#questionsPreview" + i).append(setMultimediaPreview(question))
                break;
        }
        ;
    },

    //Solicita confirmação para apagar o teste
    confirmDelete: function (e) {

        var id = $(e.currentTarget).attr("testID");
        var nome = $(e.currentTarget).attr("testName");

        var modal = delModal("Apagar professor",
            "Tem a certeza que pretende eliminar o teste <label>" + nome + " </label> ?",
            "deletebtn", id);

        $('#testsDiv').append(modal);
        $('#modalConfirmDel').modal("show");
    },


    deleteTest: function (e) {
        var self = this;
        $('#modalConfirmDel').modal("hide");
        //Apaga o professor seleccionado

        var test = new Test({id: e.target.value})

        test.destroy({
            success: function () {
                sucssesMsg($("#testsDiv"), "Teste apagado com sucesso!");
                setTimeout(function () {
                    document.location.reload(true);
                }, 2000);
            },
            error: function () {
                failMsg($("#testsDiv"), "Lamentamos mas não foi possível eliminar o teste!", 1000);
            }
        });


    },

    //Class Initializer
    initialize: function () {

        this.data = this.collection.toJSON();
        this.bd2 = 'let_questions';
        this.site = 'http://letrinhas.pt:5984';//process.env.COUCHDB;
        getStudents();
        getTypes();

    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth

        getFilters();

        self.data.sort(sortJsonByCol('title'));

        $(this.el).html(this.template({collection: self.data}));

        return this;
    }

});