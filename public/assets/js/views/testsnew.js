window.TestsNewView = Backbone.View.extend({
    events: {
        "click .addQuestion": "addQuestion",
        "click .removeQuestion": "removeQuestion",
        'click [type="checkbox"]': "filterBy",
        'click .contentFilter': "filterBycontent",
        "click #orderBy": "orderQuestions",
        "click #newtestbtn": "beforeSend",
    },

    orderQuestions: function (e) {
        var mylist = $('#allQuestions');
        orderContentList(mylist, e);
    },
    //Applys filters
    filterBy: function () {
        //Esconde todos os testes
        $("#allQuestions .listButton").show();
        //Esconde os testes cujas checkboxes não estão seleccionadas
        $.each($("input:checkbox:not(:checked)"), function (i, k) {
            console.log($(k).attr("value"))
            $("#allQuestions .listButton[type=" + $(k).attr("value") + "]").hide();
        });

        //Esconde os que ao correspondem conteudos seleccionados
        $.each($("#allQuestions .listButton:visible"), function (i, k) {
            //Se nao pertencerem à categoria escolhida, esconde-os
            if ($(k).attr("value").indexOf($("#filterSubject").attr("filter")) == -1) {
                $(k).hide();
            }
        });
        $("#questionsBadge").text($("#allQuestions .listButton:visible").length + "/" + $("#allQuestions .listButton").length)

    },

    //Applys filters
    filterBycontent: function (e) {
        var self = this;
        $("#filterSubject").attr("filter", $(e.target).attr("value"));
        self.filterBy();
    },

    //Move element to test list
    addQuestion: function (e) {

        //Move o elemento
        $("#" + $(e.currentTarget).attr("value"))
            .appendTo("#questionsList");
        //Altera o icon
        $(e.currentTarget).removeClass("fa-plus addQuestion").addClass(
            "fa-remove removeQuestion"
        );

        //Incrementa o nr de perguntas
        $("#questionsTestBadge").text($("#questionsList .listButton").length);
        $("#questionsBadge").text($("#allQuestions .listButton:visible").length + "/" + $("#allQuestions .listButton").length)

    },

    //Move element to questions list
    removeQuestion: function (e) {

        //Move o elemento
        $("#" + $(e.currentTarget).attr("value"))
            .appendTo("#allQuestions");
        //Altera o icon
        $(e.currentTarget).removeClass("fa-remove removeQuestion").addClass(
            "fa-plus addQuestion"
        )

        //Incrementa o nr de perguntas
        $("#questionsTestBadge").text($("#questionsList .listButton").length)
        $("#questionsBadge").text($("#allQuestions .listButton:visible").length + "/" + $("#allQuestions .listButton").length)

    },

    //Before Sending Request To Server
    beforeSend: function (e) {
        e.preventDefault();

        //Se algum dos campos estiver vazio
        var allListElements = $(".mandatory");
        //Verifies if all inputs are OK
        var isValid = isFormValid(allListElements);
        //If they are
        if (isValid) {
            //Recolhe os dados da view
            var testDetails = $('#newTestForm').serializeObject();
            //Cria um novo model
            var test = new Test(testDetails);
            //Converte o json das classes em objecto

            //Recolhe os ids das peguntas
            var questions = $("#newTestForm .listButton");
            //Adiciona os seus id's ao array de perguntas
            $.each(questions, function (iQ, question) {
                test.attributes.questions.push($(question).attr("id"))
            })

            console.log(questions)
            console.log(test.attributes)
            test.save(null, {
                success: function (user) {
                    sucssesMsg($(".form"), "Teste inserido com sucesso!");
                    setTimeout(function () {
                        app.navigate("tests", {
                            trigger: true
                        });
                    }, 2000);
                },
                error: function (model, response) {
                    console.log()
                    failMsg($(".form"), "Lamentamos mas não foi possível inserir o teste! \n" + JSON.parse(response.responseText).result);
                }
            });
        }
    },


    //Class Initializer
    initialize: function () {
        this.data = this.collection.toJSON();
    },

    //Class Renderer
    render: function () {
        var self = this;
        //Ordena a collection por title
        self.data.sort(sortJsonByCol('title'));

        getCategories();

        getFilters();

        //Renders view with questions collection
        this.$el.html(this.template({questions: self.data}));
        return self;
    },

})
;