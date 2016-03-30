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

        //Pagina Inicial
        "home": "home",

        //Default Page
        "": "index",

        //Menu Principal
        "dashboard": "dashboard",

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
        "student/view": "studentInfo"

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
    dashboard: function () {
        var self = this;

        this.navbar();

        //Load Template
        templateLoader.load(["Dashboard"],
            function () {
                var v = new Dashboard({});
                self.showView(v, $('#content'));
            }
        );

    },

    teachers: function () {
        var self = this;

        self.navbar();

        templateLoader.load(["TeachersView"],
            function () {
                var v = new TeachersView({});
                self.showView(v, $('#content'));
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
                var v = new UserView({});
                self.showView(v, $('#content'));
            }
        );
    },

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

        self.navbar();

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

    schoolsEdit: function (id) {
        var self = this;
        templateLoader.load(["SchoolsEdit"],
            function () {
                var v = new SchoolsEdit({id: id});
                self.showView(v, $('#content'));
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


});

templateLoader.load(["Home"],
    function () {
        app = new Router();
        Backbone.history.start();
    }
);
