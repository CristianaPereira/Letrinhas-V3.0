window.TestsView = Backbone.View.extend({
    events: {
        "click #btnTestNew":"newTest",
        "click #btnTesteCriar":"criarTeste",
        "click #btnTexto":"criarTexto",
        "click #btnLista":"criarLista",
        "click #btnMult":"criarMultimedia",
        "click #btnConfApagar":"deleteTest",
        "click #btnCancApagar":"cancelarApagar",
        "click #btnInterp":"criarInterpr",
        "click .filtroT":"filtarTipo",
        "click .filtroD":"filtarDisciplina",
        "click .filtroA":"filtarAno",
        "click #myne":"soOsMeus",
        'submit form': 'submitt',
        "keyup #testProcurar":"searchTeste",
    },

    filtarAno:function(e){
        var self=this;
        var selec=true;
        var btn = e.toElement;
        if($(btn).attr('campo')!='todos'){
            if($("#testFiltAno").attr('flag')!=1){
                self.flagFiltro+=2;
                //seleciona
                selec=true;
                $("#testFiltAno").attr('flag',1);
                $("#testFiltAno").removeClass('btn-primary');
                $("#testFiltAno").addClass('btn-success');
                $("#testFiltAno").text($(btn).attr('campo')+' ano');
                self.campoD=$(btn).attr('campo');

            }else{
                if(self.campoD==$(btn).attr('campo')){
                    //desseleciona
                    selec=false;
                    self.campoD='';
                    self.flagFiltro-=2;
                    $("#testFiltAno").addClass('btn-primary');
                    $("#testFiltAno").removeClass('btn-success');
                    $("#testFiltAno").attr('flag',0);
                    $("#testFiltAno").text("Ano Escolar");

                }
                else{
                    //seleciona
                    selec=true;
                    $("#testFiltAno").attr('flag',1);
                    $("#testFiltAno").removeClass('btn-primary');
                    $("#testFiltAno").addClass('btn-success');
                    $("#testFiltAno").text($(btn).attr('campo')+' ano');
                    self.campoD=$(btn).attr('campo');
                }
            }

        }else{
            if($("#testFiltAno").attr('flag')==1){
                //desseleciona
                selec=false;
                self.flagFiltro-=2;
                self.campoD='';
                $("#testFiltAno").addClass('btn-primary');
                $("#testFiltAno").removeClass('btn-success');
                $("#testFiltAno").attr('flag',0);
                $("#testFiltAno").text("Ano Escolar");
            }
        }

        var myBotoes = document.getElementsByClassName('testSelect');
        for (var i = 0; i < myBotoes.length; i++) {
            var position = $(myBotoes[i]).attr('ano').toLowerCase().search($(btn).attr('campo').toLowerCase() );
            if($(myBotoes[i]).attr('ano')==$(btn).attr('campo') && selec){
                $(myBotoes[i]).attr('fa',1);
            }
            else{
                $(myBotoes[i]).attr('fa',0);
            }
        }
        self.filtra();
    },

    filtarDisciplina:function(e){
        var self=this;
        var selec=true;
        var btn = e.toElement;
        if($(btn).attr('campo')!='todos'){
            if($("#testFiltDiscip").attr('flag')!=1){
                self.flagFiltro+=4;
                //seleciona
                selec=true;
                $("#testFiltDiscip").attr('flag',1);
                $("#testFiltDiscip").removeClass('btn-primary');
                $("#testFiltDiscip").addClass('btn-success');
                $("#testFiltDiscip").text($(btn).attr('campo'));
                self.campoD=$(btn).attr('campo');

            }else{
                if(self.campoD==$(btn).attr('campo')){
                    //desseleciona
                    selec=false;
                    self.campoD='';
                    self.flagFiltro-=4;
                    $("#testFiltDiscip").addClass('btn-primary');
                    $("#testFiltDiscip").removeClass('btn-success');
                    $("#testFiltDiscip").attr('flag',0);
                    $("#testFiltDiscip").text("Disciplina");

                }
                else{
                    //seleciona
                    selec=true;
                    $("#testFiltDiscip").attr('flag',1);
                    $("#testFiltDiscip").removeClass('btn-primary');
                    $("#testFiltDiscip").addClass('btn-success');
                    $("#testFiltDiscip").text($(btn).attr('campo'));
                    self.campoD=$(btn).attr('campo');
                }
            }

        }else{
            if($("#testFiltDiscip").attr('flag')==1){
                //desseleciona
                selec=false;
                self.flagFiltro-=4;
                self.campoD='';
                $("#testFiltDiscip").addClass('btn-primary');
                $("#testFiltDiscip").removeClass('btn-success');
                $("#testFiltDiscip").attr('flag',0);
                $("#testFiltDiscip").text("Disciplina");
            }
        }

        var myBotoes = document.getElementsByClassName('testSelect');
        for (var i = 0; i < myBotoes.length; i++) {
            var position = $(btn).attr('campo').toLowerCase().search( $(myBotoes[i]).attr('disciplina').toLowerCase());
            if(position!=-1 && selec){
                $(myBotoes[i]).attr('fd',1);
            }
            else{
                $(myBotoes[i]).attr('fd',0);
            }
        }
        self.filtra();
    },

    filtarTipo:function(e){
        var self=this;
        var selec=true;
        var btn = e.toElement;
        if($(btn).attr('campo')!='todos'){
            if($("#testFiltTipo").attr('flag')!=1){
                self.flagFiltro+=8;
                //seleciona
                selec=true;
                $("#testFiltTipo").attr('flag',1);
                $("#testFiltTipo").removeClass('btn-primary');
                $("#testFiltTipo").addClass('btn-success');
                $("#testFiltTipo").text($(btn).attr('campo'));
                self.campoT=$(btn).attr('campo');

            }else{
                if(self.campoT==$(btn).attr('campo')){
                    //desseleciona
                    selec=false;
                    self.campoT='';
                    self.flagFiltro-=8;
                    $("#testFiltTipo").addClass('btn-primary');
                    $("#testFiltTipo").removeClass('btn-success');
                    $("#testFiltTipo").attr('flag',0);
                    $("#testFiltTipo").text("Tipo");

                }
                else{
                    //self.flagFiltro+=8;
                    //seleciona
                    selec=true;
                    $("#testFiltTipo").attr('flag',1);
                    $("#testFiltTipo").removeClass('btn-primary');
                    $("#testFiltTipo").addClass('btn-success');
                    $("#testFiltTipo").text($(btn).attr('campo'));
                    self.campoT=$(btn).attr('campo');
                }
            }

        }else{
            if($("#testFiltTipo").attr('flag')==1){
                //desseleciona
                selec=false;
                self.flagFiltro-=8;
                self.campoT='';
                $("#testFiltTipo").addClass('btn-primary');
                $("#testFiltTipo").removeClass('btn-success');
                $("#testFiltTipo").attr('flag',0);
                $("#testFiltTipo").text("Tipo");
            }
        }

        var myBotoes = document.getElementsByClassName('testSelect');
        for (var i = 0; i < myBotoes.length; i++) {
            var position = $(myBotoes[i]).attr('tipo').toLowerCase().search($(btn).attr('campo').toLowerCase() );
            if(position!=-1 && selec){
                $(myBotoes[i]).attr('ft',1);
            }
            else{
                $(myBotoes[i]).attr('ft',0);
            }
        }
        self.filtra();
    },

    filtra:function(){
        var self=this;
        $("#testProcurar").val('');
        var cor="#53BDDC";
        var num=0;
        var conta=0;
        var myBotoes = document.getElementsByClassName('testSelect');
        for (var i = 0; i < myBotoes.length; i++) {
            var  flagObj=0;
            //buscar as flags e consturir um número considerando o esquema binário
            //só para este botão:
            //Ex: fT,fD,fA,fP = 1010, que dizer que os filtros estão ativos no tipo e disciplina
            //ao fazer AND com a flagFiltro, tenho de obter a mesma chave, se sim este botão irá aparecer!
            if($(myBotoes[i]).attr('ft')==1) flagObj+=8; //tipo
            if($(myBotoes[i]).attr('fd')==1) flagObj+=4; //disciplina
            if($(myBotoes[i]).attr('fa')==1) flagObj+=2; //ano
            if($(myBotoes[i]).attr('fp')==1) flagObj+=1; //professor
            num = (flagObj & self.flagFiltro);

            if(self.flagFiltro == num){//coincidem
                conta++;
                if($(myBotoes[i]).attr('fp')==1){
                    cor="#60cc60";
                }else{
                    cor="#53BDDC";
                }
                $(myBotoes[i]).attr("style","height:60px; text-align:left; background-color:"+cor+"; color: #ffffff;");
            }
            else{//não coincide
                $(myBotoes[i]).attr("style","display:none");
            }

        }
        if(conta<myBotoes.length){
            $("#testBadge").text(conta+" / "+myBotoes.length);
        }
        else{
            $("#testBadge").text(conta);
        }
    },

    destacaOsMeus:function(){
        var self=this;

        //subir os meus para cima!
        var btns = document.getElementsByClassName('testSelect');
        var aux;
        for (var i = 0; i < btns.length; i++) {
            if(1==$(btns[i]).attr("fp")){
                $('#testsContent').prepend($(btns[i]));
            }
        }
        //enchePreviewTexto
        self.mudaTest(btns[0]);
    },

    soOsMeus:function(e){
        var self=this;
        $("#testProcurar").val('');
        var btns = document.getElementsByClassName('testSelect');
        var conta=0;
        if($("#myne").attr("val")==0){
            self.flagFiltro+=1;
            $("#myne").attr("val",1);
        }
        else{
            self.flagFiltro-=1;
            $("#myne").attr("val",0);
        }
        self.filtra();
    },

    searchTeste: function(){
        var self=this;
        var str1= $("#testProcurar").val();
        var myBotoes = document.getElementsByClassName('testSelect');
        var cor="#53BDDC";
        var cont=0;
        $("#myne").attr("val",0);
        $("#myne").attr("checked",false);
        self.flagFiltro=0;
        //Tipo
        $("#testFiltTipo").addClass('btn-primary');
        $("#testFiltTipo").removeClass('btn-success');
        $("#testFiltTipo").attr('flag',0);
        $("#testFiltTipo").text("Tipo");
        //ano escolar
        $("#testFiltAno").addClass('btn-primary');
        $("#testFiltAno").removeClass('btn-success');
        $("#testFiltAno").attr('flag',0);
        $("#testFiltAno").text("Ano Escolar");
        //disciplina
        $("#testFiltDiscip").addClass('btn-primary');
        $("#testFiltDiscip").removeClass('btn-success');
        $("#testFiltDiscip").attr('flag',0);
        $("#testFiltDiscip").text("Dsiciplina");

        for(i=0; i< myBotoes.length; i++){
            $(myBotoes[i]).attr('ft',0);
            $(myBotoes[i]).attr('fd',0);
            $(myBotoes[i]).attr('fa',0);
            $(myBotoes[i]).attr('fp',0);
            self.campoT='';

            if(window.localStorage.getItem('ProfID')== $(myBotoes[i]).attr('professor')){
                cor="#60cc60";
            }else{
                cor="#53BDDC";
            }
            var position = $(myBotoes[i]).text().toLowerCase().search( str1.toLowerCase() );
            if(position == -1){
                $(myBotoes[i]).attr("style","display:none");
            }
            else{
                cont++;
                $(myBotoes[i]).attr("style","text-align:left; height:60px; background-color:"+cor+"; color: #ffffff;");

            }
            if(cont<myBotoes.length){
                $("#testBadge").text(cont+" / "+myBotoes.length);
            }
            else{
                $("#testBadge").text(cont);
            }
        }

    },

    criarTexto:function(){
        var sefl=this;
        sefl.tipoTeste="Texto";
        $("#btnTexto").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#00ff00');
        $("#btnTesteCriar").attr('style','visibility:initial');
        $("#btnLista").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
        $("#btnMult").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
        $("#btnInterp").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
    },

    criarLista:function(){
        var sefl=this;
        sefl.tipoTeste="Lista";
        $("#btnLista").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#00ff00');
        $("#btnTesteCriar").attr('style','visibility:initial');
        $("#btnTexto").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
        $("#btnMult").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
        $("#btnInterp").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
    },

    criarMultimedia:function(){
        var sefl=this;
        sefl.tipoTeste="Multimédia";
        $("#btnMult").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#00ff00');
        $("#btnTesteCriar").attr('style','visibility:initial');
        $("#btnTexto").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
        $("#btnLista").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
        $("#btnInterp").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
    },

    criarInterpr:function(){
        var sefl=this;
        sefl.tipoTeste="Interpretação";
        $("#btnInterp").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#00ff00');
        $("#btnTesteCriar").attr('style','visibility:initial');
        $("#btnTexto").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
        $("#btnMult").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
        $("#btnLista").attr('style','height:50px; width:200px; background-color: #53BDDC; color:#ffffff');
    },

    criarTeste:function(){
        var sefl=this;
        switch(sefl.tipoTeste){
            case 'Texto':
                app.navigate('/questionsText/new', {
                    trigger: true
                });
                break;
            case 'Lista':
                app.navigate('/questionsList/new', {
                    trigger: true
                });
                break;
            case 'Multimédia':
                app.navigate('questionsMultimedia/new', {
                    trigger: true
                });
                break;
            case 'Interpretação':
                app.navigate('questionsInterp/new', {
                    trigger: true
                });
                break;
        };

        $('#myModalTest').modal("hide");
    },

    newTest:function(){
        $('#myModalTest').modal("show");
    },

    //Esconde a caixa de confirmacao
    cancelarApagar:function(){
        $('#modalConfirmDel').modal("hide");
    },
    //Verifica se é o autor do teste. Cria msg de confirmacao. Apaga caso afirmativo
    confirmDelete:function(obj){
        var self = this;
        modem('GET', 'tests/'+$(obj).attr("val"), function(data) {
            if(data.professorId===window.localStorage.getItem('ProfID')){
                var code ='<p>Tem a certeza que pretende apagar o teste "<b>'+data.titulo+'</b>" ?</p>';
                code +="<p class='text-warning'><small>Resoluções deste teste poderão ser comprometidas.</small></p>";
                code +='<input type="hidden" id="idDel" value="'+data._id+'">';
                $('#ConfirmDelLabel').html(code);
                $('#modalConfirmDel').modal("show");
            }else{
                self.warnAlert("Lamentamos, mas apenas o criador do teste (<b>"+data.professorId+"</b>) o pode apagar!");
            }
        }, function(error) {
            self.warnAlert("Não foi possível apagar o teste. Por favor, tente novamente mais tarde.");
        });
    },

    //Elimina o teste
    deleteTest:function(){
        var self = this;
       var form = $("<form>").attr("role", "form")
            .attr("method", "POST")
            .attr("method", "POST")
            .attr("action", "/tests/"+$('#idDel').val());
        var input = $("<input>").attr("type", "hidden")
            .attr("name", "ordem")
            .val("desabilita");
        $(form).append($(input));
        $(form).submit();
        setTimeout(function() {
            self.successAlert("Teste apagado com sucesso!");
        }, 2000);
    },
    //Mensagem de sucesso
    successAlert : function(msg){
        $('#infoModalContent').html('<div id="popUpAlert" class="alert alert-success">'
                            +'<strong>Sucesso!</strong> '+msg
                            +'</div>');
        $('#infoModal').modal("show");
        setTimeout(function() {
            $('#infoModal').modal("hide").delay(2000);
        }, 2000);
    },
    //Mensagem de aviso
    warnAlert : function(msg){
        $('#infoModalContent').html('<div id="popUpAlert" class="alert alert-warning">'
            +'<strong>Ups!</strong> '+msg
            +'</div>');
        $('#infoModal').modal("show");
        setTimeout(function() {
            $('#infoModal').modal("hide").delay(2000);
        }, 3000);
    },
    //Mensagem de erro
    errorAlert : function(msg){
        $('#infoModalContent').html('<div id="popUpAlert" class="alert alert-danger">'
            +'<strong>Erro!</strong> '+msg
            +'</div>');
        $('#infoModal').modal("show");
        setTimeout(function() {
            $('#infoModal').modal("hide").delay(2000);
        }, 2000);
    },

    editTest:function(obj){
        var self = this;
        window.sessionStorage.setItem("ClonarTeste",$(obj).attr("val"));
        self.tipoTeste=$('#'+$(obj).attr("val")).attr("tipo");
        self.criarTeste();
    },

    mudaTest:function(obj){
        var self=this;
        modem('GET', 'tests/'+obj.id, function(item) {
            self.encheTestPreview(item);

        }, function(error2) {
            console.log('Error getting questions\n');
            console.log(error2);
        });

    },

    encheTestPreview:function(documnt){
        var self = this;
        self.professor = documnt.professorId;
        var f = documnt.tipo;
        switch(f){
            case 'Texto':
                self.enchePreviewTexto(documnt);
                break;
            case 'Lista':
                self.enchePreviewLista(documnt);
                break;
            case 'Multimédia':
                self.enchePreviewMultim(documnt);
                break;
            case 'Interpretação':
                self.enchePreviewInterp(documnt);
                break;
        };
    },

    enchePreviewTexto: function(documnt){
        var self=this;
        modem('GET', 'questions/'+documnt.perguntas[0], function(item) {
            var d=''

                +''
                +'' +
                ''
                +'<div class="panel panel-default col-md-12 " align=left style="height:300px; overflow:auto">'
                +''+item.conteudo.texto
                +'</div>'
                +'<div class="col-md-12 " align=left>'
                +'<label>Demo:</label>'
                +'<audio id="vozProf" controls style="width:100%">'
                +'<source src="photo/'+self.bd2+'/'+item._id+'/voz.mp3" type="audio/mpeg">'
                +'</audio><hr> '
                +'</div>';

            $('#testsPreview').html(d);

            myEl = document.getElementById('btnTestClonar');
            myEl.addEventListener('click', function() {
                self.editTest(this);
            }, false);

            myEl = document.getElementById('btnTestElimina');
            myEl.addEventListener('click', function() {
                self.confirmDelete(this);
            }, false);

            self.validaUser();

        }, function(error2) {
            console.log('Error getting questions\n');
            console.log(error2);
        });
    },

    enchePreviewLista: function(documnt){
        var self=this;
        modem('GET', 'questions/'+documnt.perguntas, function(item) {
            console.log("a buscar a pergunta: "+documnt.perguntas);
            var d='<div class="btn-group" id="btnTestEdit" style="position:absolute; left:10px">'
                    
                +'<span type="button" class="btn badge btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false" title="Opções de edição">'
                +'  <span class="glyphicon glyphicon-cog"></span>'
                +'  <span class="sr-only">Toggle Dropdown</span>'
                +'</span>'
                    
                    +'<ul class="dropdown-menu" role="menu">'
                        +'<li>'
                            +'<a title="Criar um novo teste com o mesmo conteúdo.">' +
                                '<label id="btnTestClonar" class="btn badge btn-warning" val="'+documnt._id+'">'
                                    +'<span class="glyphicon glyphicon-refresh" style="color:#80ee80"></span> '
                                    +'Clonar Teste'
                                +'</label>' +
                            '</a>'
                        +'</li>'
                        +'<li class="divider"></li>'
                        +'<li>'
                            +'<a title="Apagar este teste">' +
                '               <label id="btnTestElimina" class="btn badge btn-danger" val="'+documnt._id+'">'
                                +'<span class="glyphicon glyphicon-trash" style="color:#cccccc"></span> '
                                +'Apagar Teste'
                                +'</label>' +
                '           </a>'
                        +'</li>'
                    +'</ul>'
                +'</div>'


                +'<span class="badge btn-info">Pré-visualização de "'+documnt.titulo+'"</span><hr>'
                +'<div align=left>'
                +'  <label>Descrição:</label><span> '+documnt.descricao+'</span>'
                +'  <br><label>Pergunta:</label><span> '+item.pergunta+'</span>'
                +'</div>'

                    

                +'<div class="panel panel-default col-md-12 " aling="center" style="height:300px; overflow:auto">';
            if(item.conteudo['palavrasCL1'].length > 0) {
                d+='<div class="col-md-4">'
                    +'<span class="badge btn-success">Coluna 1</span>'
                    + self.getColunas(item.conteudo['palavrasCL1'])
                    +'</div>';
            }
            if(item.conteudo['palavrasCL2'].length > 0) {
                d+='<div class="col-md-4" style="max-height:290px; overflow:auto">'
                    +'<span class="badge btn-success">Coluna 2</span>'
                    +self.getColunas(item.conteudo['palavrasCL2'])
                    +'</div>';
            }
            if(item.conteudo['palavrasCL3'].length > 0) {
                d+='<div class="col-md-4" style="max-height:290px; overflow:auto">'
                    +'<span class="badge btn-success">Coluna 3</span>'
                    + self.getColunas(item.conteudo['palavrasCL3'])
                    +'</div>';
            }

            if( item.conteudo['palavrasCL1'].length==0
                && item.conteudo['palavrasCL2'].length==0
                && item.conteudo['palavrasCL3'].length==0
            ){
                d+='<span class="badge btn-warning">Este item não tem conteúdo</span>';
            }
            d+='</div>'

                +'<div class="col-md-12 " align=left>'
                +'<label>Demo:</label>'
                +'<audio id="vozProf" controls style="width:100%">'
                +'<source src="photo/'+self.bd2+'/'+item._id+'/voz.mp3" type="audio/mpeg">'
                +'</audio><hr> '
                +'</div>';

            $('#testsPreview').html(d);

            myEl = document.getElementById('btnTestClonar');
            myEl.addEventListener('click', function() {
                self.editTest(this);
            }, false);

            myEl = document.getElementById('btnTestElimina');
            myEl.addEventListener('click', function() {
                self.deleteTest(this);
            }, false);

            self.validaUser();


        }, function(error2) {
            console.log('Error getting questions\n');
            console.log(error2);
        });
    },

    enchePreviewMultim: function(documnt){
        var self=this;
        $('#testsPreview').html('');

        var d='<div class="btn-group" id="btnTestEdit" style="position:absolute; left:10px">'
            +'<span type="button" class="btn badge btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false"  title="Opções de edição">'
            +'<span class="glyphicon glyphicon-cog"></span>'
            +'<span class="sr-only">Toggle Dropdown</span>'
            +'</span>'
            +'<ul class="dropdown-menu" role="menu">'
            +'<li>'
            +'<a title="Criar um novo teste com o mesmo conteúdo."><label id="btnTestClonar" class="btn badge btn-warning" val="'+documnt._id+'">'
            +'<span class="glyphicon glyphicon-refresh" style="color:#80ee80"></span> '
            +'Clonar Teste'
            +'</label></a>'
            +'</li>'
            +'<li class="divider"></li>'
            +'<li>'
            +'<a title="Apagar este teste"><label id="btnTestElimina" class="btn badge btn-danger" val="'+documnt._id+'">'
            +'<span class="glyphicon glyphicon-trash" style="color:#cccccc"></span> '
            +'Apagar Teste'
            +'</label></a>'
            +'</li>'
            +'</ul>'
            +'</div>'
            +'<span class="badge btn-info" >Pré-visualização de "'+documnt.titulo+'"</span>'
            +'<hr>'
            +'<div align=left>'
            +'<label>Descrição:</label><span> '+documnt.descricao+'</span>'
            +'</div>'
            +'<hr>'



            +'<div id="paginas" style="height:474px; overflow:auto">'
            +'</div>';



        $('#testsPreview').append(d);
        var indicador=1;
        for (var i = 0; i < documnt.perguntas.length; i++) {
            modem('GET', 'questions/'+documnt.perguntas[i], function(item) {

                var corpo='';
                switch (item.conteudo.tipoDoCorpo) {
                    case 'texto':
                        corpo= '<label style="position:relative;top:20px; max-height:175px">'+item.conteudo.corpo+'</label>';
                        break;
                    case 'imagem':
                        corpo='<img src="photo/'+self.bd2+'/'+item._id+'/corpo.jpg" style="position:relative;top:20px; max-width:400px; max-height:160px">';
                        break;
                    case 'audio':
                        corpo= '<div style="position:relative;top:20px;"><img src="../img/paly_off.png" style=" width:130px">'
                            + '<br>'
                            +'<audio controls style="width:100%">'
                            +'<source src="photo/'+self.bd2+'/'+item._id+'/corpo.mp3" type="audio/mpeg">'
                            +'</audio>'
                            +'</div>';
                        break;
                    default:
                }
                var opcoes='<div>';
                var size = 12/item.conteudo.opcoes.length;
                for (var j = 0; j < item.conteudo.opcoes.length; j++) {
                    switch (item.conteudo.opcoes[j].tipo) {
                        case 'texto':
                            opcoes+=' <div class="col-sm-'+size+'">'
                                +'<span class="btn-sm btn-block" style="position:relative;top:20px;background-color:#53BDDC; color:#ffffff; height:70px;">'
                                +item.conteudo.opcoes[j].conteudo
                                +'</span>'
                                +'</div> ';
                            break;
                        case 'imagem':
                            opcoes+= ' <div class="col-sm-'+size+'">'
                                +'<span class="btn-lg btn-block" style="background-color:#53BDDC; color:#ffffff; height:70px; ">'
                                +'<img src="photo/'+self.bd2+'/'+item._id+'/op'+(j+1)+'.jpg" style=" max-height:50px; max-width:50px">'
                                +'</span>'
                                +'</div> ';
                            break;
                        default:

                    }
                }
                opcoes+='</div>';

                var g='' +
                    '<div align=left>' +
                    '   <label class="badge btn-success">Página '+indicador+': '+item.titulo+' </label>' +
                    '   <br>'
                    +'  <label>Pergunta:</label><span> '+item.pergunta+'</span>' +
                    '</div>' +

                    '<br>'

                    +'<div class="panel panel-default" align=center style=" height:200px; width:100%; color:#ffffff; background-color:#80c0ff;">'
                    +   corpo
                    +'</div>'

                    +'<div align=center style="height:140px; width:100%;">'
                    +   opcoes
                    +'</div>'
                        
                    +'<hr>';
                indicador++;
                $("#paginas").append(g);
            }, function(error2) {
                console.log('Error getting questions\n');
                console.log(error2);
            });
        }

        myEl = document.getElementById('btnTestClonar');
        myEl.addEventListener('click', function() {
            self.editTest(this);
        }, false);

        myEl = document.getElementById('btnTestElimina');
        myEl.addEventListener('click', function() {
            self.deleteTest(this);
        }, false);


        self.validaUser();

    },

    enchePreviewInterp: function(documnt){
        var self=this;
        modem('GET', 'questions/'+documnt.perguntas[0], function(item) {
            var d='<div class="btn-group" id="btnTestEdit" style="position:absolute; left:10px">'
                +'<span type="button" class="btn badge btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false"  title="Opções de edição">'
                +'<span class="glyphicon glyphicon-cog"></span>'
                +'<span class="sr-only">Toggle Dropdown</span>'
                +'</span>'
                +'<ul class="dropdown-menu" role="menu">'
                +'<li>'
                +'<a title="Criar um novo teste com o mesmo conteúdo."><label id="btnTestClonar" class="btn badge btn-warning" val="'+documnt._id+'">'
                +'<span class="glyphicon glyphicon-refresh" style="color:#80ee80"></span> '
                +'Clonar Teste'
                +'</label></a>'
                +'</li>'
                +'<li class="divider"></li>'
                +'<li>'
                +'<a title="Apagar este teste"><label id="btnTestElimina" class="btn badge btn-danger" val="'+documnt._id+'">'
                +'<span class="glyphicon glyphicon-trash" style="color:#cccccc"></span> '
                +'Apagar Teste'
                +'</label></a>'
                +'</li>'
                +'</ul>'
                +'</div>'
                +'<span class="badge btn-info">Pré-visualização de "'+documnt.titulo+'"</span><hr>'
                +'<div align=left>'
                +'<label>Descrição:</label><span> '+documnt.descricao+'</span>'
                +'<br><label>Pergunta:</label><span> '+item.pergunta+'</span>'
                +'</div>'
                    
                +'<div class="panel panel-default col-md-12 " style="height:300px; overflow:auto; text-align:justify">'
                +' <br>'+self.marcaTexto(item.conteudo.texto, item.conteudo.posicaoResposta)
                +'</div>'
                +'<div class="col-md-12 " align=left>'
                +'<label>Demo:</label>'
                +'<audio id="vozProf" controls style="width:100%">'
                +'<source src="photo/'+self.bd2+'/'+item._id+'/voz.mp3" type="audio/mpeg">'
                +'</audio><hr> '
                +'</div>';

            $('#testsPreview').html(d);

            myEl = document.getElementById('btnTestClonar');
            myEl.addEventListener('click', function() {
                self.editTest(this);
            }, false);

            myEl = document.getElementById('btnTestElimina');
            myEl.addEventListener('click', function() {
                self.deleteTest(this);
            }, false);

            self.validaUser();

        }, function(error2) {
            console.log('Error getting questions\n');
            console.log(error2);
        });


    },

    marcaTexto:function(texto, posicoes){
        var self=this;
        var text="";
        var s='<span ';
        var s1=' class="badge">';
        var palavra= s;
        var isCaracter=true;
        var posicao=1;
        var index=0;
        if(posicoes[index]==posicao){
            palavra+=s1;
            index++;
        }
        else{
            palavra+='>';
        }

        if(texto.length!=0){
            for (var i = 0; i < texto.length; i++) {
                //de acordo com a tabela ascii 1º caracter possivel '!' CODE 33
                if(texto.charCodeAt(i)<33){
                    //se o caracter anterior for válido
                    if(isCaracter){
                        //fecha a palavra
                        palavra+='</span> ';
                        posicao++;
                        //adiciona a palavra à linha
                        text+=palavra;
                        //reinicia a palavra
                        palavra= s;

                        if(posicoes[index]==posicao){
                            palavra+=s1;
                            index++;
                        }
                        else{
                            palavra+='>';
                        }
                        //não e um caracter válido (ex: "enter", "space", "tab")
                        isCaracter=false;
                    }
                }
                else{
                    //adiciona o caracter à palavra
                    palavra+=texto.charAt(i);
                    //confirma que era uma caracter
                    isCaracter=true;
                }
            }
            //entregar o resto
            if(palavra.length>0){
                palavra+='</span> ';
                text+= palavra;
            }
        }
        return text;
    },

    getColunas:function(lista){
        var coluna='';

        for(i=0;i<lista.length;i++){
            coluna+='<br>'+lista[i];
        }

        return coluna;
    },

    validaUser:function(){
        var self=this;
        //esconder os botões de inserir e editar a todos excepto o Administrador
        var role = window.localStorage.getItem('Role');
        var pId = window.localStorage.getItem('ProfID');
    },

    initialize: function() {
        var self=this;
        self.bd='dev_testes';
        self.bd2='dev_perguntas';
        self.site='http://185.15.22.235:5984';//process.env.COUCHDB;
        self.flagFiltro=0;
        self.campoT='';
        self.campoA='';
        self.campoD='';
    },

    render: function() {
        $(this.el).html(this.template());
        var self=this;
        console.log(self)
        //verificar se está logado
      /*  var controlo=window.localStorage.getItem("Logged");
        if(!controlo){
            console.log('Não Logado');
            app.navigate('/#', {
                trigger: true
            });
            return null;
        }*/

      /*  var role = ''+window.localStorage.getItem('Role');
        //criar restrições a opções consoante as permissões do utiizador.
        if(role == "Administrador do Sistema"){
            setTimeout(function(){
                $("#opDef").attr("style","display:show");
                $("#sepProf").attr("style","display:show");
            },1);

        }
*/
        modem('GET', 'me', function(data) {
            $("#user").text(data.nome);
        }, function(error) {
            console.log('Error getting user '+window.localStorage.getItem("ProfID"));
        });

        //Constrir os botões
        modem('GET', 'tests', function(data) {
            $('#testBadge').text(data.length);
            var s='';

            if(data.length == 0){
                s="<h2>Não existem testes para mostrar</h2>"
            }
            else{
                var first=true;
                for(i=0;i<data.length;i++){
                    if(data[i].doc.estado){
                        var img, img2;

                        switch(data[i].doc.tipo){
                            case 'Texto': img="../img/testeTexto.png";
                                break;
                            case 'Lista': img="../img/testLista.png";
                                break;
                            case 'Multimédia': img="../img/testMul.png";
                                break;
                            case 'Interpretação': img="../img/testInterpretacao.png";
                                break;
                            default:  img="../img/page-loader.gif";
                                break;
                        };
                        switch(data[i].doc.disciplina){
                            case 'Português': img2="../img/portugues.png";
                                break;
                            case 'Inglês': img2="../img/ingles.png";
                                break;
                            case 'Matemática': img2="../img/mate.png";
                                break;
                            case 'Estudo do Meio': img2="../img/estudoMeio.png";
                                break;
                            case 'Outra língua': img2="../img/outroLinguas2.png";
                                break;
                            case 'Outra': img2="../img/outro.png";
                                break;
                            default:  img2="../img/page-loader.gif";
                                break;
                        };

                        var cor='#53BDDC';
                        var fp=0;

                        if(window.localStorage.getItem('ProfID')==data[i].doc.professorId){
                            cor='#60cc60';
                            fp=1;
                        }

                        var date = new Date(data[i].doc.data);
                        var day = date.getDate().toString();
                        var month = (date.getMonth()+1).toString();
                        var year = date.getFullYear().toString();
                        var hours = date.getHours().toString();
                        var minutes = date.getMinutes().toString();
                        day = day.length === 2 ? day : '0' + day;
                        month = month.length === 2 ? month : '0' + month;
                        hours = hours.length === 2 ? hours : '0' + hours;
                        minutes = minutes.length === 2 ? minutes : '0' + minutes;

                        //tentar colocar mais campos nos botões para evitar muitas chamadas ao servidor
                        s+= '<button id="' + data[i].doc._id
                            +'"  type="button" style="height:60px; text-align:left; background-color:'+cor+'; color: #ffffff;"'
                            +' class="btn btn-lg btn-block testSelect" '
                            +' data="'+data[i].doc.data+'"'
                            +' ano="'+data[i].doc.anoEscolar+'" fa=0'
                            +' disciplina="'+data[i].doc.disciplina+'" fd=0'
                            +' professor="'+data[i].doc.professorId+'" fp='+fp
                            +' tipo="'+ data[i].doc.tipo +'" ft=0>'
                            +' <img src="'+img+'"  style="height:30px;" title="'+data[i].doc.tipo+'"> '
                            +' <img src="'+img2+'"  style="height:30px;" title="'+data[i].doc.disciplina+'"> '
                            + data[i].doc.titulo + ' - '+day+'.'+month+'.'+year+'</button>';
                    }
                }

            }
            $('#testsContent').html(s);
            self.destacaOsMeus();

            //Criar Eventos
            var myEl = document.getElementsByClassName('testSelect');
            for(j=0;j<myEl.length;j++){
                myEl[j].addEventListener('click', function() {
                    self.mudaTest(this);
                }, false);
            };

        }, function(error) {
            console.log('Error getting tests list!');
        });

        return this;
    },

});
