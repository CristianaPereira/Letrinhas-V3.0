window.TestsNewView = Backbone.View.extend({
    events: {
        "click .addQuestion": "addQuestion",
        "click .removeQuestion": "removeQuestion",
        "click #newtestbtn": "beforeSend",
    },

    //Move element to test list
    addQuestion: function (e) {

        //Incrementa o nr de perguntas
        $("#questionsBadge").text(parseInt($("#questionsBadge").text()) + 1)
        //Move o elemento
        $("#" + $(e.currentTarget).attr("value"))
            .appendTo("#questionsList");
        //Altera o icon
        $(e.currentTarget).removeClass("fa-plus addQuestion").addClass(
            "fa-remove removeQuestion"
        )
    },

    //Move element to questions list
    removeQuestion: function (e) {

        //Incrementa o nr de perguntas
        $("#questionsBadge").text(parseInt($("#questionsBadge").text()) - 1)
        //Move o elemento
        $("#" + $(e.currentTarget).attr("value"))
            .appendTo("#allQuestions");
        //Altera o icon
        $(e.currentTarget).removeClass("fa-remove removeQuestion").addClass(
            "fa-plus addQuestion"
        )
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
                console.log($(question).attr("id"))
            })

            console.log(test.attributes)
            test.save(null, {
                success: function (user) {
                    sucssesMsg($(".form"), "Teste inserido com sucesso!");
                    //setTimeout(function () {
                    //    app.navigate("schools", {
                    //        trigger: true
                    //    });
                    //}, 1500);
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

        //Renders view with questions collection
        this.$el.html(this.template({questions: self.data}));
        return self;
    },

})
;