Backbone.View.prototype.close = function () {
    this.remove();
    this.unbind();
    this.undelegateEvents();
};

Backbone.ajax = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    args[0].beforeSend = function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + window.sessionStorage.getItem("keyo"));
    };

    return Backbone.$.ajax.apply(Backbone.$, args);
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

        //Pagina Inicial
        "home": "home",

        //Default Page
        "": "index",

        //Teachers Routing
        "teachers": "teachers",
        "teachers/new": "teachersNew",
        "teachers/:id/edit": "teachersEdit",
        "user": "user",

        //School Routing
        "schools": "schools",
        "schools/new": "schoolsNew",
        "schools/:id": "schoolsInfo",
        "schools/:id/edit": "schoolsEdit",

        //Students Routing
        "students": "students",
        "students/new": "studentsNew",
        "students/:id": "studentsEdit",
        "student/view": "studentInfo",

        //Touch questions Routing
        "questionsTouch": "questionsTouch",
        "questionsTouch/new": "questionsTouchNew",
        "questionsTouch/edit": "questionsTouchEdit",

        "resolutions": "resolutions",
        //Tests Routing
        "questions": "questions",

        "questionsText/new": "questionsTextNew",
        "questionsText/:id": "questionsTextEdit",

        "multimediaTest/new": "multimediaTestNew",
        "listTest/new": "listTestNew",
        "interpretationTest/new": "interpretationTestNew"

    },


    //Load NavigationBar
    navbar: function () {
        var self = this;
        //Load NavigationBar
        templateLoader.load(["NavigationBarView"],
            function () {
                var v = new NavigationBarView({});
                self.showView(v, $('#header'));
            }
        );
    },


    //Default Template
    index: function () {
        app.navigate("/home", {
            trigger: true
        });
    },

    //Inic Template
    home: function () {
        var self = this;

        $('#header').html("");
        $('#content').html("");

        templateLoader.load(["Home"],
            function () {
                var v = new Home({});
                self.showView(v, $('#content'));
            }
        );
    },

    //Home Template
    resolutions: function () {
        var self = this;

        this.navbar();

        //Load Template
        templateLoader.load(["ResolutionsView"],
            function () {
                var v = new ResolutionsView({});
                self.showView(v, $('#content'));
            }
        );

    },
    //Teacher Templates
    teachers: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["TeachersView"],
            function () {
                var ss = new Teachers();
                ss.fetch(function () {
                    var v = new TeachersView({
                        model: ss
                    });
                    self.showView(v, $('#content'));
                })
            }
        );
    },

    teachersNew: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["TeachersNewView"],
            function () {
                var v = new TeachersNewView({});
                self.showView(v, $('#content'));
            }
        );
    },

    teachersEdit: function (id) {
        var self = this;

        self.navbar();

        templateLoader.load(["TeachersEditView"],
            function () {
                var v = new TeachersEditView({id: id});
                self.showView(v, $('#content'));
            }
        );
    },

    user: function () {
        var self = this;
        self.navbar();

        templateLoader.load(["UserView"],
            function () {
                var ss = new Me({});
                ss.fetch(function () {
                    var v = new UserView({
                        model: ss
                    });
                    self.showView(v, $('#content'));
                })

            }
        );
    },

    //Student Templates
    students: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["StudentsView"],
            function () {
                var v = new StudentsView({});
                self.showView(v, $('#content'));
            }
        );
    },

    studentsNew: function () {
        var self = this;

        this.navbar();

        templateLoader.load(["StudentsNewView"],
            function () {
                var v = new StudentsNewView({});
                self.showView(v, $('#content'));
            }
        );
    },

    studentsEdit: function (id) {
        var self = this;

        this.navbar();

        templateLoader.load(["StudentsEdit"],
            function () {
                var v = new StudentsEdit({id: id});
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

    //School Templates
    schools: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["SchoolsView"],
            function () {
                var ss = new Schools();
                ss.fetch(function () {
                    var v = new SchoolsView({
                        model: ss
                    });
                    self.showView(v, $('#content'));
                })
            }
        );
    },

    schoolsNew: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["SchoolsNew"],
            function () {
                var v = new SchoolsNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    schoolsEdit: function (id) {
        var self = this;

        this.navbar();

        templateLoader.load(["SchoolsEdit"],
            function () {
                var ss = new School({
                    id: id
                });
                ss.fetch(function () {
                    var v = new SchoolsEdit({
                        model: ss
                    });
                    self.showView(v, $('#content'));
                })

            }
        );
    },

    schoolsInfo: function (id) {
        var self = this;

        self.navbar();

        templateLoader.load(["SchoolsInfo"],
            function () {
                var v = new SchoolsInfo({id: id});
                self.showView(v, $('#content'));
            }
        );
    },

    //Questions template
    questionsTouch: function () {
        var self = this;
        self.navbar();
        templateLoader.load(["QuestionsTouch"],
            function () {
                var v = new QuestionsTouch({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsTouchNew: function () {
        var self = this;
        self.navbar();
        templateLoader.load(["QuestionsTouchNew"],
            function () {
                var v = new QuestionsTouchNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsTouchEdit: function () {
        var self = this;
        self.navbar();
        templateLoader.load(["QuestionsTouchEdit"],
            function () {
                var v = new QuestionsTouchEdit({});
                self.showView(v, $('#content'));
            }
        );
    },

    //Tests Templates
    questions: function () {
        var self = this;

        self.navbar();
        templateLoader.load(["QuestionsView"],
            function () {
                var ss = new Questions();
                ss.fetch(function () {
                    var v = new QuestionsView({
                        model: ss
                    });
                    self.showView(v, $('#content'));
                })
            }
        );
    },

    questionsTextNew: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["QuestionsTextNew"],
            function () {
                var v = new QuestionsTextNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    questionsTextEdit: function (id) {
        var self = this;

        self.navbar();

        templateLoader.load(["QuestionsTextEdit"],
            function () {
                var ss = new Question({
                    id: id
                });
                ss.fetch(function () {
                    var v = new QuestionsTextEdit({
                        model: ss
                    });
                    self.showView(v, $('#content'));
                })

            }
        );
    },

    multimediaTestNew: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["QuestionsMultimediaNew"],
            function () {
                var v = new QuestionsMultimediaNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    listTestNew: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["QuestionsListNew"],
            function () {
                var v = new QuestionsListNew({});
                self.showView(v, $('#content'));
            }
        );
    },

    interpretationTestNew: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["QuestionsInterpNew"],
            function () {
                var v = new QuestionsInterpNew({});
                self.showView(v, $('#content'));
            }
        );
    }

});


templateLoader.load(["Home"],
    function () {
        app = new Router();
        Backbone.history.start();
    }
);
