window.UserView = Backbone.View.extend({
    events: {
        "click #btnUserEdit": "editUser",
        "click .SelTurma": "mostraTurma",
    },

    verAluno: function (btn) {
        //Variavel a enviar, para depois poder buscar os dados do aluno a consultar
        window.sessionStorage.setItem("Aluno", $(btn).attr("val"));
        app.navigate('student/view', {
            trigger: true
        });
    },

    editUser: function (obj) {
        //Variavel a enviar, para depois poder buscar os dados do professor a editar
        window.sessionStorage.setItem("ProfEditar", window.localStorage.getItem('ProfID'));
        app.navigate('teachers/edit', {
            trigger: true
        });
    },

    initialize: function () {
        var self = this;

        self.bd = 'dev_professores';
        self.bd2 = 'dev_escolas';
        self.site = 'http://185.15.22.235:5984';
    },

    render: function () {
        $(this.el).html(this.template());

        var self = this;
        modem('GET', 'me', function (teacherData) {
            //    this.getTurmas(teacherData._id, teacherData.nome);
            $('#myPreview').empty();
            var permission;
            switch (teacherData.permissionLevel) {
                case '1' :
                    permission = "Auxiliar";
                    break;
                case '2' :
                    permission = "Professor";
                    break;
                case '3' :
                    permission = "Administrador de Sistema";
                    break;
                default:
                    permission = "Utilizador";
            }
            ;

            var $divFoto = $("<div>", {
                class: "col-md-4"
            }).append('<img src="' + teacherData.imgb64 + '"  class="dataImage">');

            var $divDados = $("<div>", {
                class: "col-md-8"
            }).append('<label class="dataTitle col-md-12">' + teacherData.nome + '</label><br>')
                .append('<label class="col-md-12 dataSubTitle">' + permission + '</label><br>')
                .append('<label class="col-md-4 lblDataDetails">E-mail:</label> <label class="col-md-8">' + teacherData._id + '</label><br>')
                .append('<label class="col-md-4 lblDataDetails">Nome:</label> <label class="col-md-8">' + teacherData.nome + '</label><br>')
                .append('<label class="col-md-4 lblDataDetails">Telefone:</label> <label  class="col-md-8">' + teacherData.telefone + ' </label><br>')
                .append('<div id="SchoolTable" class="col-md-12" align="center" style="max-height:220px; overflow:auto"></div>')
                .append('<div class="col-md-12" ><hr class="dataHr"></div><div id="prfSchool" class="col-md-12" align=left><label id="assocClasses">' + teacherData.nome + ', não tem turmas associadas.</label></div>');

            $('#myPreview').append($divFoto, $divDados);
        }, function (error) {
            console.log('Error getting teacher list!');
        });


        /*  modem('GET', 'me', function(user) {
         console.log(user);
         $("#user").text(user.nome);
         //mostrar os dados do utilizadores
         $("#userFoto").attr('src',user.imgb64);
         $("#tipoFunc").text(user.tipoFuncionario);
         $("#nome").text(user.nome);
         $("#email").text(user._id);
         $("#dados").text("Dados de "+user._id);
         $("#telefone").text(user.telefone);

         modem('GET', 'schools', function(escolas) {
         //Montar as turmas que o utilizador pertence
         var userr = window.localStorage.getItem("ProfID");
         var conta=0;
         var estaEscola=false;
         var estaTurma=false;
         var linhaEscola, btnTurma;

         for (var i = 0; i < escolas.length; i++) {
         btnTurma='<div class="col-md-8" style="height:160px;overflow:auto">';
         linhaEscola='<div class="col-md-4" style="height:160px;" >';
         for (var j = 0; j < escolas[i].doc.turmas.length; j++) {
         for (var k = 0; k < escolas[i].doc.turmas[j].professores.length; k++) {
         if(escolas[i].doc.turmas[j].professores[k].id== userr){
         conta++;
         estaTurma=true;
         estaEscola=true;
         break;
         }
         }
         //construir o botão de turma
         if(estaTurma){
         btnTurma+='<div class="col-md-4"><button class="btn-sm btn-info btn-block SelTurma"'
         +' escola="'+escolas[i].doc._id+'" turma="'+escolas[i].doc.turmas[j]._id+'">'+escolas[i].doc.turmas[j].ano
         +'º '+escolas[i].doc.turmas[j].nome+'</button><br></div> ';
         estaTurma=false;
         }
         }
         //cria linha de escola e insere os botões de turmas
         if(estaEscola){
         linhaEscola+='<img src="data:'+escolas[i].doc._attachments['escola.jpg'].content_type+';base64,'
         +escolas[i].doc._attachments['escola.jpg'].data
         +'"style="height:100px; max-width:200px"><br>'
         +'<label class="badge">'+escolas[i].doc.nome+'</label><hr></div>';
         btnTurma+='</div>';
         $("#asMinhasTurmas").append(linhaEscola);
         $("#asMinhasTurmas").append(btnTurma);
         estaEscola=false;
         }
         }

         $("#numTurmas").text(conta);

         }, function(erro2) {
         console.log('Error getting schools');
         });

         }, function(error) {
         console.log('Error getting user '+window.localStorage.getItem("ProfID"));
         });

         */

        return this;
    }

});
