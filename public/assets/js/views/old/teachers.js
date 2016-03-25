window.TeachersView = Backbone.View.extend({
  events: {
    "click #btnTeachersNew": "newTeacher",
    "keyup #profProcurar":"searchProf",
    },

  searchProf: function(){
   var self=this;
   var str1= $("#profProcurar").val();
   var myBotoes = document.getElementsByClassName('profSelec');
   var cont=0;
   for(i=0; i< myBotoes.length; i++){
     var position = $(myBotoes[i]).text().toLowerCase().search( str1.toLowerCase() );
     if(position == -1){
       $(myBotoes[i]).attr("style","display:none");
     }
     else{
       cont++;
       $(myBotoes[i]).attr("style","text-align:left; height:60px; background-color: #53BDDC; color: #ffffff;");
     }

   }
   if(cont<myBotoes.length){
     $("#teachersBadge").text(cont+" / "+myBotoes.length);
   }
   else{
     $("#teachersBadge").text(cont);
   }
  },

  validaUser:function(prof){
    var self=this;
    //esconder os botões de inserir e editar a todos excepto o Administrador
    var role = ''+window.localStorage.getItem('Role');
    var profID = ''+window.localStorage.getItem('ProfID');

    //se não é administrador nem o próprio, esconde os botões
    if( role != "Administrador do Sistema" && prof._id != profID){
      $("#btnTeacherstDrop").remove();
      $("#btnTeachersNew").remove();
    }
    else{
      //se não é administrador, mas é o próprio, esconde apenas a criação de prof.
      if( role != "Administrador do Sistema" && prof._id == profID){
        $("#btnTeachersNew").attr("style","visibility:hidden");
      }
    }


  },

  initialize: function() {
    var self=this;

    self.bd='dev_professores';
    self.site='http://185.15.22.235:5984';
  },


  render: function() {
    $(this.el).html(this.template());

    //verificar se está logado
    var controlo=window.localStorage.getItem("Logged");
    if(!controlo){
      console.log('Não Logado');
      app.navigate('/#', {
          trigger: true
        });
        return null;
    }

    var role = ''+window.localStorage.getItem('Role');
    //criar restrições a opções consoante as permissões do utiizador.
    if(role == "Administrador do Sistema"){
      setTimeout(function(){
        $("#opDef").attr("style","display:show");
        $("#sepProf").attr("style","display:show");
      },1);

    }

    modem('GET', 'teachers/'+window.localStorage.getItem("ProfID"), function(data) {
      $("#user").text(data.nome);
    }, function(error) {
      console.log('Error getting user '+window.localStorage.getItem("ProfID"));
    });

    var self=this;
    modem('GET', 'teachers', function(data) {
      //indicar quantos items existem
      $('#teachersBadge').text(data.length);
      //construir os botões de selecção do professor
      var s='';
      var first=true;
      for(i=0;i<data.length;i++){
        if(data[i].doc.estado=='Ativo' || data[i].doc.estado==1){

        s+= '<button id="'
          + data[i].doc._id
          + '"  name="' + data[i].doc._id
          +'"  type="button" style="height:60px; text-align:left; background-color: #53BDDC; color: #ffffff;"'
          +' class="btn btn-lg btn-block profSelec" >';
          try {
            s+=' <img src="data:'+data[i].doc._attachments['prof.jpg'].content_type
                        +';base64,'
                        +data[i].doc._attachments['prof.jpg'].data
                        +'" style="height:30px;" > ';

          } catch (e) {
            s+=' <img src="../img/page-loader.gif" style="height:25px;">';
          } finally {
            s+= data[i].doc.nome + '</button>';
          }


          if(first){
            $('#teachersPreview').html(self.enchePreview(data[i].doc));
            self.validaUser(data[i].doc);

            first=false;
          }
        }
      }

      $('#teachersContent').html(s);

      self.getTurmas();

      document.getElementById(data[0].doc._id).focus();

      //Criar Eventos
      var myEl = document.getElementsByClassName('profSelec');
      for(j=0;j<myEl.length;j++){
        myEl[j].addEventListener('click', function() {
                      self.mudaProf(this);
                    }, false);
      };
      try{
        myEl = document.getElementById('btnTeachersEdit');
        myEl.addEventListener('click', function() {
                      self.editTeacher(this);
                    }, false);

        myEl = document.getElementById('btnTeacherElimina');
        myEl.addEventListener('click', function() {
                      self.deleteTeacher(this);
                    }, false);
      }
      catch (er2){}
    }, function(error) {
      console.log('Error getting teachers list!');
    });

    return this;
  },

  getTurmas:function(){
    var self=this;
    modem('GET','schools', function(json){
      var s='<div align="left">';
      var has=false;
      var contTurmas=0;
      for(i=0; i< json.length; i++){
        var escola="<div><div class='col-md-7'><label>"+json[i].doc.nome+': </label></div>';
        var turma='';
        for(j=0; j< json[i].doc.turmas.length; j++){
          for(k=0; k<json[i].doc.turmas[j].professores.length; k++){
            var g=""+json[i].doc.turmas[j].professores[k].id;
            var f=""+$("#profEmail").text();
            if(f == g){
              has=true;
            }
          }
          if(has){
            turma+='<span> - '+json[i].doc.turmas[j].ano+'º ano, '+json[i].doc.turmas[j].nome+'</span><br>';
            has=false;
            contTurmas++;
          }
        }
        if(turma.length>1){
          s+=escola+"<div class='col-md-4'>"+turma+"<br></div></div><br>";
        }
      }
      if(contTurmas>0){
        s+="</div>";
        $("#SchoolTable").html(s);
        $("#prfSchool").text($("#profNome").text()+", tem "+contTurmas+" turmas associadas.");
      }
    },
    function(error) {
      console.log('Error getting schools list!');
    });
  },

  mudaProf:function(obj){
    var self=this;
    //vai buscar os dados do professor:
    modem('GET','teachers/'+obj.id, function(json){
      $('#teachersPreview').html(self.enchePreview(json));
      self.validaUser(json);
      var myEl = document.getElementById('btnTeachersEdit');
      try{
        myEl.addEventListener('click', function() {
                      self.editTeacher(this);
                    }, false);

        myEl = document.getElementById('btnTeacherElimina');
        myEl.addEventListener('click', function() {
                      self.deleteTeacher(this);
                    }, false);
      }
      catch (er2){}
      self.getTurmas();
    },
    function(error) {
      console.log('Error getting teachers list!');
    });
  },

  enchePreview: function(documnt){
    var self=this;
    var html='<div class="btn-group" id="btnTeacherstDrop" style="position:absolute; left:10px">'
          +'<span type="button" class="btn badge btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'
          +'<span class="glyphicon glyphicon-cog"></span>'
          +'<span class="sr-only">Toggle Dropdown</span>'
          +'</span>'
          +'<ul class="dropdown-menu" role="menu">'
            +'<li>'
              +'<a><label id="btnTeachersEdit" class="btn badge btn-warning" val="'+documnt._id+'">'
                +'<span class="glyphicon glyphicon-refresh" style="color:#80ee80"></span> '
                 +'Editar Dados'
              +'</label></a>'
            +'</li>'
            +'<li class="divider"></li>'
            +'<li>'
            +'<a><label id="btnTestElimina" class="btn badge btn-danger" val="'+documnt._id+'">'
              +'<span class="glyphicon glyphicon-trash" style="color:#cccccc"></span> '
               +'Apagar Utilizador'
            +'</label></a>'
            +'</li>'
          +'</ul>'
        +'</div>';
    html+= '<img src="photo/'+self.bd+'/'+documnt._id+'/prof.jpg"  style="height:220px;max-width:430px">';
    html+= '<br><div align=left class="col-md-9"><span><label class="badge">Nome:</label> <label id="profNome">'+documnt.nome+'</label></span>';
    html+= '<br><span><label class="badge">E-mail:</label> <span id="profEmail">'+documnt._id+'</span></span>';
    html+= '<br><span><label class="badge">Telefone:</label> <span>'+documnt.telefone+' </span></span>';
    html+= '<br><span><label class="badge">Tipo de utilizador:</label> <span>'+documnt.tipoFuncionario+' </span></span></div>';
    html+='<br><br><br><br><hr>';
    html+= '<div id="prfSchool" class="col-md-12" align=left>'+documnt.nome+', não tem turmas associadas.</div><br><br>';
    html+= '<div id="SchoolTable" class="col-md-12" align="center" style="max-height:220px; overflow:auto"></div>';

    return html;
  },


  newTeacher: function (e) {
    e.preventDefault();
    app.navigate('/teachers/new', {
      trigger: true
    });
  },

  editTeacher: function (obj) {
    //Variavel a enviar, para depois poder buscar os dados do professor a editar
    window.sessionStorage.setItem("ProfEditar", $(obj).attr("val"));
    app.navigate('teachers/edit', {
      trigger: true
    });
  },

  deleteTeacher: function (obj) {
    app.navigate('/man', {
      trigger: true
    });
  },



});
