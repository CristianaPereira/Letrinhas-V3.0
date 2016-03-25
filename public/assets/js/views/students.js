window.StudentsView = Backbone.View.extend({
  events: {
     "click #btnStudentsNew":"newAluno",
     "click .filtroT":"filtarTurma",
     "click .filtroE":"filtarEscola",
     "keyup #alunoProcurar":"searchAluno",
     },

  filtarTurma:function(e){
    var self=this;
    var selec=true;
    var btn = e.toElement;
      if($("#alFiltTurma").attr('flag')!=1){
        self.flagFiltro++;
        //seleciona
        selec=true;
        $("#alFiltTurma").attr('flag',1);
        $("#alFiltTurma").removeClass('btn-primary');
        $("#alFiltTurma").addClass('btn-success');
        $("#lblTurma").text($(btn).text());
        self.campoT=$(btn).attr('id');
      }else{
        if(self.campoT==$(btn).attr('id')){
          //desseleciona
          selec=false;
          self.campoT='';
          self.flagFiltro--;
          $("#alFiltTurma").addClass('btn-primary');
          $("#alFiltTurma").removeClass('btn-success');
          $("#lblTurma").text('');
          $("#alFiltTurma").attr('flag',0);
        }
        else{
          //seleciona
          selec=true;
          $("#alFiltTurma").attr('flag',1);
          $("#alFiltTurma").removeClass('btn-primary');
          $("#alFiltTurma").addClass('btn-success');
          $("#lblTurma").text($(btn).text());
          self.campoT=$(btn).attr('id');
        }
      }

    var myBotoes = document.getElementsByClassName('studSelec');
    for (var i = 0; i < myBotoes.length; i++) {
     var position = $(myBotoes[i]).attr('turma').toLowerCase().search($(btn).attr('id').toLowerCase() );
      if(position!=-1 && selec){
       $(myBotoes[i]).attr('ft',1);
      }
      else{
        $(myBotoes[i]).attr('ft',0);
      }
    }
    self.filtra();
  },

  filtarEscola:function(e){
    var self=this;
    var selec=true;
    var btn = e.toElement;
      if($("#alFiltEscola").attr('flag')!=1){
        self.flagFiltro+=2;
        //seleciona
        selec=true;
        $("#alFiltEscola").attr('flag',1);
        $("#alFiltEscola").removeClass('btn-primary');
        $("#alFiltEscola").addClass('btn-success');
        $("#lblEscola").text($(btn).text());
        self.campoE=$(btn).attr('id');
        self.getTurmas($(btn).attr('id'));
      }else{
        if(self.campoE==$(btn).attr('id')){
          //desseleciona
          selec=false;
          self.campoE='';
          self.flagFiltro-=2;
          $("#alFiltEscola").addClass('btn-primary');
          $("#alFiltEscola").removeClass('btn-success');
          $("#lblEscola").text('');
          $("#alFiltEscola").attr('flag',0);
          $("#dropTurma").html('');
        }
        else{
          //seleciona
          selec=true;
          $("#alFiltEscola").attr('flag',1);
          $("#alFiltEscola").removeClass('btn-primary');
          $("#alFiltEscola").addClass('btn-success');
          $("#lblEscola").text($(btn).text());
          self.campoE=$(btn).attr('id');
          self.getTurmas($(btn).attr('id'));
        }
      }

    var myBotoes = document.getElementsByClassName('studSelec');
    for (var i = 0; i < myBotoes.length; i++) {
     var position = $(myBotoes[i]).attr('escola').toLowerCase().search($(btn).attr('id').toLowerCase() );
      if(position!=-1 && selec){
       $(myBotoes[i]).attr('fe',1);
      }
      else{
        $(myBotoes[i]).attr('fe',0);
      }
    }
    //para retirar o filtro de turmas, caso esteja ativo
    if((self.flagFiltro%2)!=0){
      self.flagFiltro--;
      self.campoT='';
    }
    self.filtra();
  },

  filtra:function(){
    var self=this;
    $("#alunoProcurar").val('');
    var cor="#53BDDC";
    var num=0;
    var conta=0;
    var myBotoes = document.getElementsByClassName('studSelec');
    for (var i = 0; i < myBotoes.length; i++) {
      var  flagObj=0;
      //buscar as flags e consturir um número considerando o esquema binário
      //só para este botão:
      //Ex: fe,ft = 10, que dizer que os filtros estão ativos na escola
      //ao fazer AND com a flagFiltro, tenho de obter a mesma chave, se sim este botão irá aparecer!
      if($(myBotoes[i]).attr('fe')==1) flagObj+=2; //escola
      if($(myBotoes[i]).attr('ft')==1) flagObj+=1; //turma
      num = (flagObj & self.flagFiltro);

      if(self.flagFiltro == num){//coincidem
        conta++;
        $(myBotoes[i]).attr("style","height:60px; text-align:left; background-color:"+cor+"; color: #ffffff;");
      }
      else{//não coincide
        $(myBotoes[i]).attr("style","display:none");
      }

    }
    if(conta<myBotoes.length){
      $("#studentsBadge").text(conta+" / "+myBotoes.length);
    }
    else{
      $("#studentsBadge").text(conta);
    }
  },

  getTurmas:function(escola) {
    //limpar o painel de filtro
    $("#dropTurma").html('');
    //preencher painel de filtro por turma da escola selecionada
    var self=this;
    var dropTurma= '<button id="alFiltTurma" type="button" class="btn btn btn-sm btn-primary" style="width:100px" flag="0">Turma</button>'
                  +'<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'
                    +'<span class="caret"></span>'
                    +'<span class="sr-only">Toggle Dropdown</span>'
                  +'</button>'
                  +'<ul class="dropdown-menu" role="menu">';
    modem('GET', 'schools/'+escola, function(school) {
      for (var i = 0; i < school.turmas.length; i++) {
        dropTurma+='<li>'
                    +'<a id="'+school.turmas[i]._id+'" class="filtroT">'
                      +'<label>'
                        +school.turmas[i].ano+'º '
                        +school.turmas[i].nome
                      +'</label> '
                    +'</a>'
                  +'</li>';
      }
      dropTurma+='</ul><span id="lblTurma" style="font-size:10px; color:#aaaaaa;"></span>';
      $("#dropTurma").html(dropTurma);
    }, function(error2) {
      console.log('Error getting school: '+escola);
      console.log(error2);
    });

  },

  searchAluno: function(){
    var self=this;
    var str1= $("#alunoProcurar").val();
    var myBotoes = document.getElementsByClassName('studSelec');
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
      $("#studentsBadge").text(cont+" / "+myBotoes.length);
    }
    else{
      $("#studentsBadge").text(cont);
    }
  },

  newAluno: function(e) {
    e.preventDefault();
    app.navigate('/students/new', {
    trigger: true
    });
  },

  deleteAluno: function (obj) {
    app.navigate('man', {
      trigger: true
    });
  },

  editAluno: function (obj) {
    //Variavel a enviar, para depois poder buscar os dados do aluno a editar
    window.localStorage.setItem("AlunoEditar", obj.name);
    app.navigate('man', {
      trigger: true
    });
  },

  initialize: function() {
    var self=this;
    self.bd='dev_alunos';
    self.bd2='dev_escolas';
    self.site='http://185.15.22.235:5984';
    self.flagFiltro=0;
    self.campoT='';
    self.campoE='';
  },

  render: function() {
    var self=this;
    $(this.el).html(this.template());

    modem('GET', 'me', function(data) {
      $("#user").text(data.nome);
    }, function(error) {
      console.log('Error getting user '+window.localStorage.getItem("ProfID"));
    });

    //preencher painel de filtro por escola
    modem('GET', 'schools', function(escolas) {
      for (var i = 0; i < escolas.length; i++) {
          var opt='<li>'
                    +'<a id="'+escolas[i].doc._id+'" class="filtroE">'
                      +'<span>'
                        +'<img src="data:'+escolas[i].doc._attachments['escola.jpg'].content_type+';base64,'
                        +escolas[i].doc._attachments['escola.jpg'].data
                        +'"style="height:32px;">'
                      +'</span> '
                      +escolas[i].doc.nome
                    +'</a>'
                  +'</li>';
          $("#listaEscola").append(opt);
      }

      }, function(error) {
        console.log('Error getting schools list!');
    });



    modem('GET', 'students', function(data) {
      $('#studentsBadge').text(data.length);
      var s='';
        var first=true;
      for(i=0;i<data.length;i++){
          if(data[i].doc.estado=='Ativo' || data[i].doc.estado==true || data[i].doc.estado== 1){
        s+= '<button id="'+ data[i].doc._id
            +'" name="'+data[i].doc._id
            +'" type="button" style="height:60px; text-align:left; background-color: #53BDDC; color: #ffffff;"'
            +' class="btn btn-lg btn-block studSelec"'
            +' escola="'+data[i].doc.escola+'"'
            +' turma="'+data[i].doc.turma+'"'
            +' fe=0 ft=0>'
              +'<img src="data:'+data[i].doc._attachments['aluno.jpg'].content_type+';base64,'
              +data[i].doc._attachments['aluno.jpg'].data
              +'" style="height:30px;"> - '+ data[i].doc.nome
            +'</button>';
            if(first){
              $('#studentsPreview').html(self.encheStudPreview(data[i].doc));
              self.validaUser();
              first=false;
            }
        }
    }
    $('#studentsContent').html(s);
    self.getTurma(data[0].doc.turma);
    document.getElementById(data[0].doc._id).focus();
    // até aqui é o preview
    //Criar Eventos
    var myEl = document.getElementsByClassName('studSelec');
    for(j=0;j<myEl.length;j++){
      myEl[j].addEventListener('click', function() {
                    self.mudaAluno(this);
                  }, false);
    };
    try{
      myEl = document.getElementById('btnStudentsEdit');
      myEl.addEventListener('click', function() {
                    self.editAluno(this);
                  }, false);

      myEl = document.getElementById('btnStudentElimina');
      myEl.addEventListener('click', function() {
                    self.deleteAluno(this);
                  }, false);
    }
    catch(er2){

    }
    }, function(error) {
      console.log('Error getting students list! \n'+ error);
    });
      return this;
  },

  mudaAluno: function(obj){
    var self=this;
    //vai buscar os dados do aluno:
    modem('GET','students/'+obj.id, function(json){
      $('#studentsPreview').html(self.encheStudPreview(json));
      self.validaUser();
      try{
        var myEl = document.getElementById('btnStudentsEdit');
        myEl.addEventListener('click', function() {
                      self.editAluno(this);
                    }, false);
        myEl = document.getElementById('btnStudentElimina');
        myEl.addEventListener('click', function() {
                      self.deleteAluno(this);
                    }, false);
      }
      catch (er2){}
      self.getTurma(json.turma);

    },
    function(error) {
      console.log('Error getting students list!');
    });
  },

  getTurma: function(turma){
    var s='';
    modem('GET','schools', function(json){
      for(i=0; i< json.length; i++){
        for(j=0; j< json[i].doc.turmas.length; j++){
          if(turma == json[i].doc.turmas[j]._id){
            $("#turmaAluno").text(json[i].doc.turmas[j].ano+"º ano, "+json[i].doc.turmas[j].nome+" da "+ json[i].doc.nome);
            return;
          }
        }
      }
    },
    function(error) {
      console.log('Error getting schools list!');
    });
  },

  encheStudPreview: function(documnt){
    var self=this;
    var html='<div class="btn-group" id="btnStudentDrop" style="position:absolute; left:15px">'
          +'<span type="button" class="btn badge btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'
          +'<span class="glyphicon glyphicon-cog"></span>'
          +'<span class="sr-only">Toggle Dropdown</span>'
          +'</span>'
          +'<ul class="dropdown-menu" role="menu">'
            +'<li>'
              +'<a><label id="btnStudentsEdit" class="btn badge btn-warning" val="'+documnt._id+'">'
                +'<span class="glyphicon glyphicon-refresh" style="color:#80ee80"></span> '
                 +'Editar dados'
              +'</label></a>'
            +'</li>'
            +'<li class="divider"></li>'
            +'<li>'
            +'<a><label id="btnStudentElimina" class="btn badge btn-danger" val="'+documnt._id+'">'
              +'<span class="glyphicon glyphicon-trash" style="color:#cccccc"></span> '
               +'Eliminar Aluno'
            +'</label></a>'
            +'</li>'
          +'</ul>'
        +'</div>'
    html+= '<img src="photo/'+self.bd+'/'+documnt._id+'/aluno.jpg"  style="height:220px; max-width:430px">';
    html+= '<br><div align=left class="col-md-12"><span><label class="badge">Nome:</label> <label id="alunoNome">'+documnt.nome+'</label></span>';
    html+= '<br><span><label class="badge">Numero de Aluno:</label> <span>'+documnt.numero+' </span></span>';
    html+= '<br><span><label class="badge">Turma:</label> <span id="turmaAluno">Sem Turma...</span></span></div>';

    html+='<br><br><br><br><hr>'
        +'Apresentar nível de evolução...<img src="../img/inConstruction.jpg"  style="height:40px;"><br><hr>'
        +'Listar Resoluções feitas (Corrigidas ou  não)...<img src="../img/inConstruction.jpg"  style="height:40px;"><br><hr>';

    return html;

  },

  validaUser:function(){
    var self=this;
    //esconder os botões de inserir e editar a todos excepto o Administrador
    var role = ''+window.localStorage.getItem('Role');

    if( role != "Professor" && role != "Administrador do Sistema"){
      $("#btnStudentDrop").remove();
      $("#btnStudentsNew").remove();
    }
  },

});
