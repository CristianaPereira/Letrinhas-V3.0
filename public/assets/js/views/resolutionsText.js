window.ResolutionsTextView = Backbone.View.extend({
    events: {

        'click [type="checkbox"]': "filterBy",
        'click .questBox > span': "resolWord",
        'click #confCorrection': "confCorrection",
        'mouseleave .listButton': "closeDD"
    },

    //Mostra o modal com os parametros finais da correccao
    confCorrection: function (e) {
        e.preventDefault();
        var res = this.data;
        var $loginModal = $("<div>", {
                class: "modal fade", tabindex: "-1", id: "mLogin", role: "dialog",
                "aria-labelledby": "myModalLabel", "aria-hidden": "true"
            }).append(
            $("<div>", {class: "modal-dialog"}).append(
                $("<div>", {class: "modal-content"}
                    // MODAl HEATHER
                ).append(
                    $("<div>", {class: "modal-header"}).append(
                        $("<button>", {
                            type: "button", class: "close", "data-dismiss": "modal", "aria-label": "Close"
                        }),
                        $("<h3>", {
                            class: "modal-title", text: "Sumário"
                        })
                    )
                    // MODAl HEATHER
                ).append(
                    $("<div>", {
                        class: "modal-body form-horizontal",
                    }).append(
                        //nota
                        $('<div>', {class: "input-group"}).append(
                            $('<span>', {class: "input-group-addon btn-white"}).append(
                                $('<i>', {class: "fa fa-minus"})
                            ),
                            $('<input>', {class: "form-control", disabled: 'disabled', type: "text"}),
                            $('<span>', {class: "input-group-addon btn-white"}).append(
                                $('<i>', {class: "fa fa-plus"})
                            )
                        ),
                        //Aluno
                        $('<div>', {class: "row input-group"}).append(
                            $('<span>', {class: "input-group-addon btn-white"}).append(
                                $('<i>', {class: "fa fa-graduation-cap"})
                            ),
                            $('<input>', {
                                class: "form-control",
                                value: res.student.name,
                                readonly: 'readonly',
                                type: "text"
                            })
                        ),
                        //titulo
                        $('<div>', {class: "row input-group"}).append(
                            $('<span>', {class: "input-group-addon btn-white"}).append(
                                $('<i>', {class: "fa fa-tag"})
                            ),
                            $('<input>', {
                                class: "form-control",
                                value: res.question.title,
                                readonly: 'readonly',
                                type: "text"
                            })
                        ),
                        //titulo
                        $('<div>', {class: "row input-group"}).append(
                            $('<span>', {class: "input-group-addon btn-white"}).append(
                                $('<i>', {html: "Total de palavras"})
                            ),
                            $('<input>', {
                                class: "form-control",
                                value: res.question.content.text.split(" ").length,
                                readonly: 'readonly',
                                type: "text"
                            })
                        )
                    )
                ).append(
                    $("<div>", {
                        class: "modal-footer",
                    }).append(
                        $("<button>", {
                            type: "submit", id: "loginbtn", class: "btn btn-lg btn-login btn-sucess",
                            text: "Entrar",
                            onClick: "attemptLogin()"
                        })
                    )
                )
            ))
            ;
        $(".form").append($loginModal);
        $("#mLogin").modal("show");
    },

    resolWord: function (e) {
        var $target = $(e.currentTarget);
        //TRoca o span pela dd dos erros
        $(e.currentTarget).replaceWith(showCorrectionDD($target.html(), $target.attr('id')))


    },
    initialize: function () {
        var self = this;
        self.bd2 = 'let_resolutions';

    }
    ,
    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Class Renderer
    render: function () {

        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }

        self.data = self.model.toJSON();
        console.log(self.data)
        $(this.el).html(this.template({model: self.data}));

        return this;

    }
});
