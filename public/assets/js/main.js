Backbone.View.prototype.close = function () {
    this.remove();
    this.unbind();
    this.undelegateEvents();
};

var Router = Backbone.Router.extend({
    currentView: undefined,
    showView: function (view, elem, sub) {
        elem.show();
        if (sub == false) {
            if (this.currentView)
                this.currentView.close();
            this.currentView = view;
            this.currentView.delegateEvents();

        }
        var rendered = view.render();
        elem.html(rendered.el);
    },
    routes: {
        "teachers": "teachers",
        "teachers/new": "teachersNew",
        "teachers/:id/edit": "teachersEdit",
        "user": "user",

        "students": "students",
        "students/new": "studentsNew",
        "students/edit": "studentsEdit",
        "student/view": "studentInfo",

        "schools": "schools",
        "schools/new": "schoolsNew",
        "schools/edit": "schoolsEdit",
        //  "schools/:id": "schoolsInfo",

        //Testes
        "tests": "tests",

        //Perguntas de:
        //  Texto
        "questionsText": "questionsText",
        "questionsText/new": "questionsTextNew",
        "questionsText/edit": "questionsTextEdit",

        //  Lista de Palavras
        "questionsList": "questionsList",
        "questionsList/new": "questionsListNew",
        "questionsList/edit": "questionsListEdit",

        //  Mutlimédia
        "questionsMultimedia": "questionsMultimedia",
        "questionsMultimedia/new": "questionsMultimediaNew",
        "questionsMultimedia/edit": "questionsMultimediaEdit",

        //  Interpretação
        "questionsInterp": "questionsInterp",
        "questionsInterp/new": "questionsInterpNew",
        "questionsInterp/edit": "questionsInterpEdit",

        //Resoluções:
        "submissions": "submissions",

        //Menu Principal
        "MenuPrincipal": "MenuPrincipal",

        //Pagina de Manutenção
        "man": "man",

        //Pagina Inicial
        "inicio": "inicio",

        //Default Page
        "": "index"
    },

    //Default Template
    index: function () {
        app.navigate("/inicio", {
            trigger: true
        });
    },

    //Inic Template
    inicio: function () {
        var self = this;
        templateLoader.load(["Inicio"],
            function () {
                var v = new Inicio({});
                self.showView(v, $('#content'));
            }
        );
    },

    //Home Template
    MenuPrincipal: function () {
        var self = this;

        this.topMenu();

        //Load Template
        templateLoader.load(["MenuPrincipalView"],
            function () {
                var v = new MenuPrincipalView({});
                self.showView(v, $('#content'));
            }
        );

    },

    //Load NavigationBar
    topMenu:function () {
        var self = this;
        //Load NavigationBar
        templateLoader.load(["NavigationBarView"],
            function () {
                var v = new NavigationBarView({});
                self.showView(v, $('#header'));
            }
        );
    },

    teachers: function () {
        var self = this;

        self.topMenu();

        templateLoader.load(["TeachersView"],
            function () {
                var v = new TeachersView({});
                self.showView(v, $('#content'));
            }
        );
    },

    teachersNew: function () {
        var self = this;

        self.topMenu();

        templateLoader.load(["TeachersNewView"],
            function () {
                var v = new TeachersNewView({});
                self.showView(v, $('#content'));
            }
        );
    },






    teachersEdit: function (id) {
        var self = this;

        self.topMenu();

        templateLoader.load(["TeachersEditView"],
            function () {
                var v = new TeachersEditView({id:id});
                self.showView(v, $('#content'));
            }
        );
    },

    user: function () {
        var self = this;
        templateLoader.load(["UserView"],
            function () {
                var v = new UserView({});
                self.showView(v, $('#content'));
            }
        );
    },

    students: function () {
        var self = this;
        templateLoader.load(["StudentsView"],
            function () {
                var v = new StudentsView({});
                self.showView(v, $('#content'));
            }
        );
    },

    studentsNew: function () {
        var self = this;
        templateLoader.load(["StudentsNewView"],
            function () {
                var v = new StudentsNewView({});
                self.showView(v, $('#content'));
            }
        );
    },

    studentsEdit: function () {
        var self = this;
        templateLoader.load(["StudentsEdit"],
            function () {
                var v = new StudentsEdit({});
                self.showView(v, $('#content'));
            }
        );
    },

    studentInfo: function () {
        var self = this;
        templateLoader.load(["StudentInfo"],
            function () {
                var v = new StudentInfo({});
                self.showView(v, $('#content'));
            }
        );
    },

    schools: function () {
        var self = this;
        templateLoader.load(["SchoolsView"],
            function () {
                var v = new SchoolsView({});
                self.showView(v, $('#content'));
            }
        );
    },

    schoolsNew: function () {
        var self = this;
        templateLoader.load(["SchoolsNew"],
            function () {
                var v = new SchoolsNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    schoolsEdit: function () {
        var self = this;
        templateLoader.load(["SchoolsEdit"],
            function () {
                var v = new SchoolsEdit({});
                self.showView(v, $('#content'));
            }
        );
    },

    tests: function () {
        var self = this;

        self.topMenu();

        templateLoader.load(["TestsView"],
            function () {
                var v = new TestsView({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsText: function () {
        var self = this;

        self.topMenu();

        templateLoader.load(["QuestionsText"],
            function () {
                var v = new QuestionsText({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsTextNew: function () {
        var self = this;

        self.topMenu();

        templateLoader.load(["QuestionsTextNew"],
            function () {
                var v = new QuestionsTextNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsTextEdit: function () {
        var self = this;

        self.topMenu();

        templateLoader.load(["QuestionsTextEdit"],
            function () {
                var v = new QuestionsTextEdit({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsList: function () {
        var self = this;

        self.topMenu();

        templateLoader.load(["QuestionsList"],
            function () {
                var v = new QuestionsList({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsListNew: function () {
        var self = this;

        self.topMenu();

        templateLoader.load(["QuestionsListNew"],
            function () {
                var v = new QuestionsListNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsListEdit: function () {
        var self = this;
        templateLoader.load(["QuestionsListEdit"],
            function () {
                var v = new QuestionsListEdit({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsMultimedia: function () {
        var self = this;
        templateLoader.load(["QuestionsMultimedia"],
            function () {
                var v = new QuestionsMultimedia({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsMultimediaNew: function () {
        var self = this;
        templateLoader.load(["QuestionsMultimediaNew"],
            function () {
                var v = new QuestionsMultimediaNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsMultimediaEdit: function () {
        var self = this;
        templateLoader.load(["QuestionsMultimediaEdit"],
            function () {
                var v = new QuestionsMultimediaEdit({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsInterp: function () {
        var self = this;
        templateLoader.load(["QuestionsInterp"],
            function () {
                var v = new QuestionsInterp({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsInterpNew: function () {
        var self = this;
        templateLoader.load(["QuestionsInterpNew"],
            function () {
                var v = new QuestionsInterpNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsInterpEdit: function () {
        var self = this;
        templateLoader.load(["QuestionsInterpEdit"],
            function () {
                var v = new QuestionsInterpEdit({});
                self.showView(v, $('#content'));
            }
        );
    },

    submissions: function () {
        var self = this;
        templateLoader.load(["SubmissionsView"],
            function () {
                var v = new SubmissionsView({});
                self.showView(v, $('#content'));
            }
        );
    },

    answersText: function () {
        var self = this;
        templateLoader.load(["AnswersText"],
            function () {
                var v = new AnswersText({});
                self.showView(v, $('#content'));
            }
        );
    },

    answersTextCorr: function () {
        var self = this;
        templateLoader.load(["AnswersTextCorr"],
            function () {
                var v = new AnswersTextCorr({});
                self.showView(v, $('#content'));
            }
        );
    },

    answersList: function () {
        var self = this;
        templateLoader.load(["AnswersList"],
            function () {
                var v = new AnswersList({});
                self.showView(v, $('#content'));
            }
        );
    },

    answersListCorr: function () {
        var self = this;
        templateLoader.load(["AnswerListtCorr"],
            function () {
                var v = new AnswersListCorr({});
                self.showView(v, $('#content'));
            }
        );
    },

    answersMultimedia: function () {
        var self = this;
        templateLoader.load(["AnswersMultimedia"],
            function () {
                var v = new AnswersMultimedia({});
                self.showView(v, $('#content'));
            }
        );
    },

    answersInterp: function () {
        var self = this;
        templateLoader.load(["AnswersInterp"],
            function () {
                var v = new AnswersInterp({});
                self.showView(v, $('#content'));
            }
        );
    },

    // Manutenção
    man: function () {
        var self = this;
        templateLoader.load(["manView"],
            function () {
                var v = new manView({});
                self.showView(v, $('#content'));
            }
        );
    },

});

templateLoader.load(["Inicio"],
    function () {
        app = new Router();
        Backbone.history.start();
    }
);
