window.TestsNewView = Backbone.View.extend({
    events: {
        "click .addQuestion": "addQuestion",
        "click .removeQuestion": "removeQuestion",
        'click [type="checkbox"]': "filterBy",
        'click .contentFilter': "filterBycontent",
        "click #orderBy": "orderQuestions",
        "blur .emptyField": "isEmpty",
        "click #newtestbtn": "beforeSend",
    },

    orderQuestions: function (e) {
        var mylist = $('#allQuestions');
        orderContentList(mylist, e);
    },

    //Verifies if an input is empty
    isEmpty: function (e) {
        if ($(e.currentTarget).val().length != 0) {
            $(e.currentTarget).removeClass("emptyField");
        }
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
        console.log($(e.currentTarget).attr("questID"))
        //Move o elemento para a lista de perg seleccionadas
        $("#" + $(e.currentTarget).attr("questID"))
            .appendTo("#questionsList");
        //Altera o botao
        $(e.currentTarget).html("-").removeClass("btn-Add addQuestion").addClass(
            "btn-Rmv removeQuestion"
        );
        //Adiciona a dd de importancia da question
        console.log($(e.currentTarget).parent())
        $(e.currentTarget).parent().append(getImportanceDD())
        //Incrementa o nr de perguntas
        $("#questionsTestBadge").text($("#questionsList .panel").length);
        $("#questionsBadge").text($("#allQuestions .panel:visible").length + "/" + $("#allQuestions .panel").length)

    },

    //Move element to questions list
    removeQuestion: function (e) {

        //Move o elemento
        $("#" + $(e.currentTarget).attr("questID"))
            .appendTo("#allQuestions");
        //Altera o icon
        $(e.currentTarget).html("+").removeClass("removeQuestion btn-Rmv").addClass(
            "btn-Add addQuestion"
        )

        //Incrementa o nr de perguntas
        $("#questionsTestBadge").text($("#questionsList .panel").length)
        $("#questionsBadge").text($("#allQuestions .panel:visible").length + "/" + $("#allQuestions .panel").length)

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
            test.attributes.questions = [];

            //Recolhe os paineis das peguntas
            var questions = $("#newTestForm .panel");
            //Adiciona os seus id's e a sua dificuldade ao array de perguntas
            $.each(questions, function (iQ, question) {
                test.attributes.questions.push({
                    _id: $(question).attr("id"),
                    dif: $("#" + $(question).attr("id") + " select").val()
                });
                //Converte para inteiro
                test.attributes.type = parseInt(test.attributes.type);
                test.attributes.schoolYear = parseInt(test.attributes.schoolYear);
            })

            console.log(questions)
            console.log(test.attributes)
            test.save(null, {
                success: function (user) {
                    sucssesMsg($(".form"), "Teste inserido com sucesso!");
                    /*  setTimeout(function () {
                     app.navigate("tests", {
                     trigger: true
                     });
                     }, 2000);*/
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
        getStudents();
    },

    //Class Renderer
    render: function () {
        var self = this;
        //Ordena a collection por title
        self.data.sort(sortJsonByCol('title'));
        console.log(self.students)
        getCategories();

        getFilters();

        getTypes();

        //Renders view with questions collection
        this.$el.html(this.template({questions: self.data}));
        return self;
    },

})
;