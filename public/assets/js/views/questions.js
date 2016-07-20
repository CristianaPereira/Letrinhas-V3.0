window.QuestionsView = Backbone.View.extend({
    events: {
        "click #deletebtn": "deleteQuestion",
        "click .deleteQuest": "confirmDelete",
        'click [type="checkbox"]': "filterBy",
        'click dropdown-submenu': "filterBy",
        'click .contentFilter': "filterBycontent",
        "keyup #txtSearch": "filterBy",
        'click .listButton': "enchePreview",

        "click #orderBy": "orderQuestions"
    },

    //Solicita confirmação para apagar o professor
    confirmDelete: function (e) {

        var id = $(e.currentTarget).attr("questionID");
        var title = $(e.currentTarget).attr("questionTitle");

        var modal = delModal("Apagar pergunta",
            "Tem a certeza que pretende eliminar a pergunta <label>" + title + " </label> ?",
            "deletebtn", id);


        $('#questionsDiv').append(modal);
        $('#modalConfirmDel').modal("show");
    },

    //Remove School
    deleteQuestion: function (e) {
        e.preventDefault();
        $('#modalConfirmDel').modal("hide");
        var question = new Question({id: e.target.value})

        question.destroy({
            success: function (user, response) {
                sucssesMsg($("body"), response.result);
                setTimeout(function () {
                    document.location.reload(true);
                }, 2000);
            },
            error: function (test, ajaxOptions, thrownError) {
                var json = JSON.parse(ajaxOptions.responseText);
                failMsg($("body"), json.result);
            }
        });
    },

    orderQuestions: function (e) {
        var mylist = $('#questionsContent');
        orderContentList(mylist, e);
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

    //Text Preview
    enchePreview: function (e) {
        var question = this.collection.getByID($(e.currentTarget).attr("id"));
        var self = this;
        //Clear Preview, fill preview

        $("#questionsPreview").empty()
            .append(
                $('<div>', {
                    class: "dropdown"
                }).append(
                    $('<button>', {
                        class: "btn btn-default dropdown-toggle", type: "button",
                        'data-toggle': "dropdown"
                    }).append(
                        $('<label>', {
                            class: "dataTitle col-md-12", text: question.title + "  "
                        }).append(
                            $('<i>', {
                                class: "fa fa-gear"
                            })
                        )
                    ),
                    $('<ul>', {
                        class: "dropdown-menu"
                    }).append(
                        $('<li>').append(
                            $('<a>', {
                                href: "#questions/" + question._id + "/info", html: '  Clonar pergunta'
                            }).prepend(
                                '<i class="fa fa-clone"></i>'
                            )
                        ),

                        //Se o user for o autor da pergunta
                        (question.profID == window.sessionStorage.getItem('username') ?
                            $('<li>').append(
                                $('<a>', {
                                    href: "#questions" + question.type + "/" + question._id + "/edit",
                                    html: '  Editar pergunta'
                                }).prepend(
                                    '<i class="fa fa-edit"></i>'
                                )
                            ) : '')
                        ,

                        //Se o user for o autor da pergunta
                        (question.profID == window.sessionStorage.getItem('username') ?
                            $('<li>').append(
                                $('<a>', {
                                    html: '  Eminar pergunta',
                                    class: 'deleteQuest',
                                    questionID: question._id,
                                    questionTitle: question.title
                                }).prepend(
                                    '<i class="fa fa-trash"  ></i>'
                                )
                            ) : '')
                    )
                )
                ,
                ('<hr class="dataHr">'),

                $('<div>', {
                    class: "form-group"
                }).append(
                    $('<label>', {
                        class: "col-md-3 lblDataDetails", text: "Pergunta:"
                    }),
                    $('<label>', {
                        class: "col-md-9 ", text: question.question
                    })
                )
            )
        ;
        switch (question.type) {
            case 'text':
                $("#questionsPreview").append(getTextPreview(question));
                setSyncr(question)
                break;
            case 'list':
                $("#questionsPreview").append(setListPreview(question))
                break;
            case 'interpretation':
                $("#questionsPreview").append(setInterpretationPreview(question))
                break;
            case 'multimedia':
                $("#questionsPreview").append(setMultimediaPreview(question));
                break;
            case 'boxes':
                $("#questionsPreview").append(setBoxesPreview(question));
                break;
            case 'whitespaces':
                $("#questionsPreview").append(setWhiteSpacesPreview(question));
                break;
        }
        ;
    },

    //Class Initializer
    initialize: function () {
        var self = this;
        self.bd2 = 'let_questions';
        self.site = 'http://127.0.0.1:5984';//process.env.COUCHDB;
        self.data = self.collection.toJSON();
    },

    //Class Renderer
    render: function () {
        var self = this;

        getFilters();

        self.data.sort(sortJsonByCol('title'));

        $(this.el).html(this.template({collection: self.data}));

        return this;
    }
})
;