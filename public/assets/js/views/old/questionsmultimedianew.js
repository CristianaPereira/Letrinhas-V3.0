window.QuestionsMultimediaNew = Backbone.View.extend({
  events: {
    "click #criarPerg":"showCriar",
    "click #buttonCancelar":"cancelForm",
    "click #aproveitarPerg":"showEditar",
    "click #eliminarPerg":"desabilitarPreg",

    "click #tipPText":"perguntaTexto",
    "click #tipPImg":"perguntaImg",
    "click #tipPAudio":"perguntaAudio",

    "click #tipRText":"respostaTexto",
    "click #tipRImg":"respostaImg",
    "click #testBadge":"addCrResposta",
    "click #testBadge2":"removeCrResposta",

    "click #add":"addLista",
    "click #remove":"removeLista",
    "click #up":"cima",
    "click #down":"baixo",
    "click #btnPergCriar":"subNPerg",
    "click #subMultim":"submitTeste",

    "change #InputPerguntaImg":"verpergImg",
    "change #InputPerguntaAudio":"verpergAudio",
    "change .imags":"verRespImg",

    "change .preenche":"verCamposTeste",
    "change .preencheCr":"verCamposCriar",

    "change .actLista":"getPerguntas",

    "dblclick .pergunta":"showPergunta",

  },

  submitTeste:function(e){
    e.preventDefault();
    var self=this;

    var op = prompt("Quantas vezes é que o aluno poderá repetir este teste?");
    var r= ''+parseInt(op);
    if(r == 'NaN' || op<0){
      alert("Digite um número válido! S.f.f.");
    }
    else{
      var myElems = document.getElementsByClassName('inptsH');
      for (var i = 0; i < myElems.length; i++) {
        $(myElems).remove();
      }

      //construir o inputs de perguntas
      var lista2 = document.getElementById("newlistMultQuestions");
      var s= '<input type="number" class="inptsH" name="nPrg" value='+lista2.length+'> ';
      for(i=0; i< lista2.length; i++ ){
        s+='<input type="text" class="inptsH" name="p'+i+'" value='+lista2[i].value+'> ';
      }
      $("#painelInvisivel").append(s);

      var input = $("<input>").attr("type", "hidden")
                              .attr("name", "profID")
                              .val(window.localStorage.getItem("ProfID"));
      $("#painelInvisivel").append($(input));
      input = $("<input>").attr("type", "hidden")
                              .attr("name", "nRepeticoes")
                              .val(parseInt(op));
      $("#painelInvisivel").append($(input));

      $("#multimNewForm").submit();
    }

  },

  verCamposTeste:function(){
    var self=this;
    var lista2 = document.getElementById("newlistMultQuestions");
    if(lista2.length>0
        && $("#inputTitulo").val().length>0
        && $("#inputDescricao").val().length>0){
          $("#subMultim").attr("disabled",false);
        }
    else{
      $("#subMultim").attr("disabled",true);
    }
  },

  desabilitarPreg:function(e){
    e.preventDefault();
    var self = this;

    if(confirm("Tem a certeza que quer eliminar esta pergunta?") == 1){
      var i = window.sessionStorage.getItem("nPG");
      i--;
      window.sessionStorage.setItem("nPG",i);
      var form = $("<form>").attr("role", "form")
                            .attr("method", "POST")
                            .attr("method", "POST")
                            .attr("action", "/questions/"+self.idPergunta);
      var input = $("<input>").attr("type", "hidden")
                              .attr("name", "tipo")
                              .val("Multimédia");
      $(form).append($(input));
      $(form).submit();
    }
    $("#pergPreview").modal("hide");
  },

  verCamposCriar:function(){
    var self=this;
    //buscar todos os campos obrigatórios
    var myEl = document.getElementsByClassName('preencheCr');
    var cont=0;

    //verificar se estão preenchidos
    for(i=0;i<myEl.length; i++){
      if($(myEl[i]).val().length!=0){
        cont++;
      }
    }

    //se todos estão preenchidos, então hbilita o botão de submeter.
    if(cont == myEl.length && cont>4){
      //habilitar o botão de submeter
      $("#btnPergCriar").attr("disabled",false);

      //adicioinar parametros invisíveis ao form, para tratamento na inserção
      var input = $("<input>").attr("type", "hidden")
                              .attr("id","hablitSub")
                              .attr("name", "profIDs")
                              .val(window.localStorage.getItem("ProfID"));
      $('#criarPergHidden').append($(input));
    }
    else{
      //senão desabilitar o botão de submeter
      $("#btnPergCriar").attr("disabled",true);
      $("#hablitSub").remove();
    }
    console.log("Botão: "+ $("#hablitSub").attr("name"));

  },

  cancelForm: function(e){
    e.preventDefault();
    window.history.go(parseInt(window.sessionStorage.getItem("nPG")));
    window.sessionStorage.removeItem("nPG");
  },

  verRespImg: function(e){
    //var self=this;
    var s=''+e.target.id;
    var alvo= s.substring(12);
    if($("#"+s).val().length >0 ){
      var tmppath = URL.createObjectURL(e.target.files[0]);
      $("#imgResp"+alvo).attr("src",tmppath);
      $("#imgResp"+alvo).attr("style","height:40px; width:40px; visibility:initial");
    }
    else{
      $("#imgResp"+alvo).attr("src","");
      $("#imgResp"+alvo).attr("style","height:40px; width:40px; visibility:hidden");
    }
  },

  verpergImg: function(e){
    var self=this;
    if($("#InputPerguntaImg").val().length >0 ){
      var tmppath = URL.createObjectURL(e.target.files[0]);
      $("#imgPrg").attr("src",tmppath);
      $("#imgPrg").attr("style"," height:60px; visibility:initial");
    }
    else{
      $("#imgPrg").attr("src","");
      $("#imgPrg").attr("style","height:60px; visibility:hidden");
    }
  },

  verpergAudio: function(e){
    var self=this;
    if($("#InputPerguntaAudio").val().length >0 ){
      var tmppath = URL.createObjectURL(e.target.files[0]);
      $("#playPlayer").attr("src",tmppath);
      $("#playPlayer").attr("style","width:100%; visibility:initial");
    }
    else{
      $("#playPlayer").attr("src","");
      $("#playPlayer").attr("style","visibility:hidden");
    }
  },

  removeCrResposta:function(e){
    var self=this;
    if(self.nRespostas>2){
      self.nRespostas--;
      $("#nRespNew").val(self.nRespostas);
      $("#lbl"+self.nRespostas).remove();
      $("#inpt"+self.nRespostas).remove();
      $("#img"+self.nRespostas).remove();
      if(self.nRespostas==2){
        document.getElementById("testBadge2").style.visibility="hidden";
      }
      document.getElementById("testBadge").style.visibility="initial";
      self.verCamposCriar();
    }
  },

  addCrResposta:function(e){
    var self = this;
    if(self.nRespostas<4){
      var s='';
      switch (self.tipoR) {
        case "txt":
          s='<div class="col-sm-3" id="lbl'+self.nRespostas+'">'
            +'<br><label for="InputRespTxt'+self.nRespostas+'">'+self.nRespostas+'ª Errada:</label>'
          +'</div>'
          +'<div class="col-sm-9" id="inpt'+self.nRespostas+'">'
            +'<br><input type="text" class="form-control preencheCr" id="InputRespTxt'+self.nRespostas
            +'" placeholder="Ex: '+parseInt(Math.random()*100)+'" name="resposta'+(self.nRespostas)+'">'
          +'</div>';
          break;
        case "img":
          s='<div class="col-sm-3" id="lbl'+self.nRespostas+'">'
              +'<br><label for="InputRespImg'+self.nRespostas+'">'+self.nRespostas+'ª Errada:</label>'
            +'</div>'
            +'<div class="col-sm-7" id="inpt'+self.nRespostas+'">'
              +'<br><input type="file" accept="image/jpg" class="form-control imags preencheCr" id="InputRespImg'+self.nRespostas
              +'" name="resposta'+(self.nRespostas)+'">'
            +'</div>'
            +'<div class="col-sm-2" id="img'+self.nRespostas+'" >'
              +'<br><img id="imgResp'+self.nRespostas+'" src="" style="visibility:hidden">'
            +'</div>';
          break;
        default:
      }
      self.nRespostas++;
      $("#nRespNew").val(self.nRespostas);

      if(self.nRespostas==3){
        document.getElementById("testBadge2").style.visibility="initial";
      }
      if(self.nRespostas==4){
        document.getElementById("testBadge").style.visibility="hidden";
      }
      $("#respContent").append(s);
      self.verCamposCriar();
    }
  },

  subNPerg:function(e){
    var i = window.sessionStorage.getItem("nPG");
    i--;
    window.sessionStorage.setItem("nPG",i);

    var s= '<input type="text" name="tipo" value="Multimédia">';
    $("#criarPergHidden").append(s);

    //titulo
    window.sessionStorage.setItem("titulo", $("#inputTitulo").val());
    //descricao
    window.sessionStorage.setItem("descricao", $("#inputDescricao").val());
    //indexAno
    var obj = document.getElementById("selectAno");
    window.sessionStorage.setItem("indexAno", obj.selectedIndex);

    //indexDiscipl
    obj = document.getElementById("selectDiscip");
    window.sessionStorage.setItem("indexDiscipl", obj.selectedIndex);

    $("#multimNewPergForm").submit();
    $("#mLoad").attr("style","height:25px; display:show");
  },

  cima:function(e){
    var lista1 = document.getElementById("newlistMultQuestions");
    var indx = lista1.selectedIndex;
    if(indx>0){
      lista1.options[indx].selected=false;
      var val = lista1.options[indx].value;
      var txt = lista1.options[indx].text;
      lista1.options[indx].value = lista1.options[indx-1].value;
      lista1.options[indx].text = lista1.options[indx-1].text;
      lista1.options[indx-1 ].value = val;
      lista1.options[indx-1 ].text = txt;
      lista1.options[indx-1].selected=true;
    }
  },

  baixo:function(e){
    var lista1 = document.getElementById("newlistMultQuestions");
    var indx = lista1.selectedIndex;
    if(indx< lista1.length-1 && indx>(-1)){
      lista1.options[indx].selected=false;
      var val = lista1.options[indx].value;
      var txt = lista1.options[indx].text;
      lista1.options[indx].value = lista1.options[indx+1].value;
      lista1.options[indx].text = lista1.options[indx+1].text;
      lista1.options[indx+1 ].value = val;
      lista1.options[indx+1 ].text = txt;
      lista1.options[indx+1].selected=true;
    }
  },

  addLista:function(e) {
    var self=this;
    var lista1 = document.getElementById("listMultQuestions");
    var lista2 = document.getElementById("newlistMultQuestions");

    for(i=(lista1.length-1); i> (-1); i--){
      if(lista1.options[i].selected == true){
        var podePassar = true;
        lista1.options[i].selected = false;
        for(j=0; j< lista2.length; j++){
          lista2.options[j].selected = false;
          if(lista2.options[j].value==lista1.options[i].value){
            podePassar=false;
            lista2.options[j].selected = true;
          }
        }
        if(podePassar){
          $("#newlistMultQuestions").append(lista1.options[i]);
        }
      }
    }
    $("#multBadge").text(lista1.length);
    $("#multBadge2").text(lista2.length);
    self.verCamposTeste();

  },

  removeLista:function(e) {
    var self=this;
    var lista1 = document.getElementById("newlistMultQuestions");
    var lista2 = document.getElementById("listMultQuestions");
    for(i=(lista1.length-1); i> (-1); i--){
      if(lista1.options[i].selected == true){
        var podePassar = true;
        lista1.options[i].selected = false;
        for(j=0; j< lista2.length; j++){
          if(lista2.options[j].value==lista1.options[i].value){
            podePassar=false;
            lista1.options[i]=null;
          }
        }
        if(podePassar){
          $("#listMultQuestions").append(lista1.options[i]);
        }
      }
    }
    self.verCamposTeste();
    $("#multBadge").text(lista2.length);
    $("#multBadge2").text(lista1.length);
  },

  showPergunta:function(e){
    var self=this;
    var obj = e.toElement;
    self.idPergunta=obj.value;
    $("#pergPreview").modal("show");
    $("#pLoad").attr("style","display:show; height:25px");
    $("#putAudio").html('');

    modem('GET', '/questions/'+self.idPergunta, function(data) {
      var date = new Date(data.dataCri);
      var day = date.getDate().toString();
      var month = date.getMonth().toString();
      var year = date.getFullYear().toString();
      var hours = date.getHours().toString();
      var minutes = date.getMinutes().toString();
      day = day.length === 2 ? day : '0' + day;
      month = month.length === 2 ? month : '0' + month;
      hours = hours.length === 2 ? hours : '0' + hours;
      minutes = minutes.length === 2 ? minutes : '0' + minutes;
      $("#pTitulo").text(data.titulo+' - '+day+'.'+month+'.'+year);
      self.titulo = data.titulo;
      $("#pPergunta").text(data.pergunta);
      var s='';
      $("#pCorpo").remove();
      switch (data.conteudo.tipoDoCorpo) {
        case 'texto':
          $("#pTipoCrp").val("texto");
          s= '<label id="pCorpo">'+data.conteudo.corpo+'</label>'
          $("#prvCorpo").append(s);
          break;
        case 'imagem':
          $("#pTipoCrp").val("imagem");
          s='<img id="pCorpo" src="photo/'+self.bd+'/'+data._id+'/corpo.jpg" style=" max-width:450px; max-height:120px">';
          $("#prvCorpo").append(s);
          break;
        case 'audio':
          $("#pTipoCrp").val("audio");
          s= '<div id="pCorpo"><img src="../img/paly_off.png" style=" width:70px">'
            + '<br>'
            +'<audio controls class="players" style="width:100%">'
            +'<source id="srcAudio" src="photo/'+self.bd+'/'+data._id+'/corpo.mp3" type="audio/mpeg">'
            +'</audio></div>';
            $("#prvCorpo").append(s);
            s= '<audio class="players" controls style="width:100%">'
                +'<source id="srcAudio" src="photo/'+self.bd+'/'+data._id+'/corpo.mp3" type="audio/mpeg">'
              +'</audio>';
            $("#putAudio").append(s);
          break;
        default:
      }

      for (var i = 1; i <5; i++) {
        $("#pR0"+i).remove();
      }
      self.nResptt=data.conteudo.opcoes.length;
      var size = 12/data.conteudo.opcoes.length;
      for (var i = 0; i < data.conteudo.opcoes.length; i++) {
        switch (data.conteudo.opcoes[i].tipo) {
          case 'texto':
            $("#pTipoResp").val("texto");
            s= '<div id="pR0'+(i+1)+'" class="col-sm-'+size+'">'
                +'<span class="btn-lg btn-block" id="r0'+(i+1)+'"style="background-color:#53BDDC; color:#ffffff; height:70px; ">'
                  +data.conteudo.opcoes[i].conteudo
                +'</span>'
              +'</div>';
            $("#prvRespostas").append(s);
            break;
          case 'imagem':
            $("#pTipoResp").val("imagem");
            s= '<div id="pR0'+(i+1)+'" class="col-sm-'+size+'">'
                +'<span class="btn-lg btn-block" style="background-color:#53BDDC; color:#ffffff; height:70px; ">'
                  +'<img id="r0'+(i+1)+'" src="photo/'+self.bd+'/'+data._id+'/op'+(i+1)+'.jpg" style="max-height:50px; max-width:50px">'
                +'</span>'
              +'</div>';
            $("#prvRespostas").append(s);
            break;
          default:

        }
      }
      $("#pLoad").attr("style","display:none");
    }, function(error) {
      console.log('Error getting question! \n'+error);
    });
  },

  showCriar:function(e){
    e.preventDefault();
    $("#myModalLabel").text("Criar pergunta Multimédia.");
    $("#InputPTitulo").attr("placeholder","Ex: Anita vai ao zoo");
    $("#InputPPergunta").attr("placeholder","Ex: Escolha a resposta mais adequada");
    $("#tipoCPergunta").text("Tipo do corpo da pergunta:");
    $("#pergContent").html('');
    //apagar se possível o anterior corpo
    $("#crpPergunta").remove();

    $("#tipoRespostas").text("Tipo de corpo das respostas:");
    $("#respContent").html('');
    //apagar se possível o anterior corpo
    $("#crpRespostas").remove();

    document.getElementById("testBadge2").style.visibility="hidden";
    document.getElementById("testBadge").style.visibility="hidden";
    $("#newPrgAno").val($("#selectAno").val());
    $("#newPrgDiscip").val($("#selectDiscip").val());
    $("#createPerg").modal("show");
  },

  showEditar:function(e){
    e.preventDefault();
    var self=this;
    $("#pergPreview").modal("hide");

    $("#myModalLabel").text("Alterar pergunta Multimédia.");
    $("#newPrgAno").val($("#selectAno").val());
    $("#newPrgDiscip").val($("#selectDiscip").val());

    $("#InputPTitulo").attr("placeholder",self.titulo);
    $("#InputPTitulo").val('');

    $("#InputPPergunta").val('');
    $("#InputPPergunta").attr("placeholder",
                            $("#pPergunta").text());

    //corpo pergunta
    $("#createPerg").modal("show");

    switch ($("#pTipoCrp").val()) {
      case "texto":
        $("#tipPText").click();
        $("#InputPerguntaTxt").attr("placeholder",$("#pCorpo").text());
        break;
      case "imagem":
        $("#tipPImg").click();
        $("#imgPrg").attr("src",$("#pCorpo").attr("src"));
        $("#imgPrg").attr("style","height:60px; visibility:initial");
        break;
      case "audio":
        $("#tipPAudio").click();
        $("#playPlayer").attr("src",$("#srcAudio").attr("src"));
        $("#playPlayer").attr("style","width:100%; visibility:initial");
        break;
      default:
    }

    //respostas
    switch ($("#pTipoResp").val()) {
      case 'texto':
        $("#tipRText").click();
        for (var i = 0; i < (self.nResptt-2); i++) {
          $("#testBadge").click();
        }
        for (var i = 0; i < self.nResptt; i++) {
          $("#InputRespTxt"+i).attr("placeholder",$("#r0"+(i+1)).text());
        }
        break;
      case 'imagem':
        $("#tipRImg").click();
        for (var i = 0; i < (self.nResptt-2); i++) {
          $("#testBadge").click();
        }
        for (var i = 0; i < self.nResptt; i++) {


          $("#imgResp"+i).attr("src",$("#r0"+(i+1)).attr("src"));
          $("#imgResp"+i).attr("style","height:40px; width:40px; visibility:initial");
        }
        break;
      default:

    }
    $("#mLoad").attr("style","display:none");

  },

  //Perguntas
  perguntaTexto: function(){
    var s='';
      s='<div class="col-sm-12" >'
          +'<br>'
          +'<input type="text" class="form-control preencheCr" id="InputPerguntaTxt" placeholder="Ex: 5 + 5 - 2 = ?" name="corpo">'
        +'</div>';
    $("#pergContent").html(s);
    //apagar se possível o anterior corpo
    $("#crpPergunta").remove();
    //add no hidden o tipo de corpo
    s='<input id="crpPergunta" type="text" name="MtipoPerg" value="texto">';
    $("#criarPergHidden").append(s);
    $("#tipoCPergunta").text("Tipo do corpo da pergunta: Texto");
  },

  perguntaImg: function(){
    var s='';
      s= '<div class="col-sm-9" >'
          +'<br>'
          +'<input type="file" class="form-control preencheCr" id="InputPerguntaImg" accept="image/jpg" name="corpo">'
        +'</div>'
        +'<div class="col-sm-3" >'
          +'<br>'
          +'<img id="imgPrg" src="" style="visibility:hidden; height:60px;">'
        +'</div>';
    $("#pergContent").html(s);
    $("#tipoCPergunta").text("Tipo do corpo da pergunta: Imagem");

    //apagar se possível o anterior corpo
    $("#crpPergunta").remove();
    //add no hidden o tipo de corpo
    s='<input id="crpPergunta" type="text" name="MtipoPerg" value="imagem">';
    $("#criarPergHidden").append(s);

  },

  perguntaAudio: function(){
    var s='';
      s='<div class="col-sm-12" >'
          +'<br>'
          +'<input type="file" class="form-control preencheCr" id="InputPerguntaAudio" accept="audio/mp3" name="corpo">'
          +'<audio id="playPlayer" class="players" style="width:100%; visibility:hidden" controls></audio>'
        +'</div>';
    $("#pergContent").html(s);
    $("#tipoCPergunta").text("Tipo do corpo da pergunta: Audio");
    //apagar se possível o anterior corpo
    $("#crpPergunta").remove();
    //add no hidden o tipo de corpo
    s='<input id="crpPergunta" type="text" name="MtipoPerg" value="audio">';
    $("#criarPergHidden").append(s);

  },

  //Respostas
  respostaTexto: function(){
    var self=this;
    self.nRespostas=2;
    self.tipoR="txt";
    var s='';
      s= '<div class="col-sm-3" >'
          +'<br><label for="InputRespTxt0">Correta:</label>'
        +'</div>'
        +'<div class="col-sm-9">'
          +'<br><input type="text" class="form-control preencheCr" id="InputRespTxt0" placeholder="Ex: Oceano" name="resposta0">'
        +'</div>'
        +'<div class="col-sm-3">'
          +'<br><label for="InputRespTxt1">1ª Errada:</label>'
        +'</div>'
        +'<div class="col-sm-9">'
          +'<br><input type="text" class="form-control preencheCr" id="InputRespTxt1" placeholder="Ex: Laranja" name="resposta1">'
        +'</div>';
    $("#respContent").html(s);

    $("#tipoRespostas").text("Tipo de corpo das respostas: Texto");
    //apagar se possível o anterior corpo
    $("#crpRespostas").remove();
    //add no hidden o tipo de corpo
    s= '<input id="crpRespostas" type="text" name="MtipoResp" value="texto">';
    $("#nRespNew").val(self.nRespostas);

    $("#criarPergHidden").append(s);


    document.getElementById("testBadge").style.visibility="initial";
    document.getElementById("testBadge2").style.visibility="hidden";

  },

  respostaImg: function(){
    var self=this;
    self.nRespostas=2;
    self.tipoR="img";
    var s='';
      s= '<div class="col-sm-3" >'
          +'<br><label for="InputRespImg0">Correta:</label>'
        +'</div>'
        +'<div class="col-sm-7">'
          +'<br><input type="file" input type="file" accept="image/jpg" class="form-control imags preencheCr" id="InputRespImg0" name="resposta0">'
        +'</div>'
        +'<div class="col-sm-2">'
          +'<br><img id="imgResp0" src="" style="visibility:hidden">'
        +'</div>'
        +'<div class="col-sm-3" >'
            +'<br><label for="InputRespImg1">1ª Errada:</label>'
        +'</div>'
        +'<div class="col-sm-7">'
          +'<br><input type="file" input type="file" accept="image/jpg" class="form-control imags preencheCr" id="InputRespImg1" name="resposta1">'
        +'</div>'
        +'<div class="col-sm-2">'
          +'<br><img id="imgResp1" src="" style="visibility:hidden">'
        +'</div>'
        ;

    $("#respContent").html(s);

    $("#tipoRespostas").text("Tipo de corpo das respostas: Imagens");
    //apagar se possível o anterior corpo
    $("#crpRespostas").remove();
    //add no hidden o tipo de corpo
    s='<input id="crpRespostas" type="text" name="MtipoResp" value="imagem">';
    $("#nRespNew").val(self.nRespostas);

    $("#criarPergHidden").append(s);

    document.getElementById("testBadge").style.visibility="initial";
    document.getElementById("testBadge2").style.visibility="hidden";


  },

  initialize: function() {
    var self=this;

    self.bd='dev_perguntas';
    self.site='http://185.15.22.235:5984'
  },

  render: function() {
    var self=this;
    $(this.el).html(this.template());
    //verificar se está logado
    var controlo=window.localStorage.getItem("Logged");
    if(!controlo){
      app.navigate('/#', {
          trigger: true
        });
        return null;
    }
    var role = ''+window.localStorage.getItem('Role');
    //se não é professor, volta para menuprincipal
    if(role != "Professor"){
        app.navigate('/#', {
          trigger: true
        });
        return null;
    }

    setTimeout(function(){
      //verificar se está a Clonar
      if(window.sessionStorage.getItem("ClonarTeste")){
        console.log("está a clonar!!");

        self.vaiClonar(window.sessionStorage.getItem("ClonarTeste"));
      }else{
        //desbloquear os inputs
        $("#inputTitulo").attr("disabled",false);
        $("#inputDescricao").attr("disabled",false);
        $("#listMultQuestions").attr("disabled",false);
        $("#newlistMultQuestions").attr("disabled",false);
        $("#criarPerg").attr("disabled",false);
      }

      console.log(window.sessionStorage.getItem("ClonarTeste"));
      window.sessionStorage.removeItem("ClonarTeste");
    },50);

    //para usar no botão voltar.
    if(!window.sessionStorage.getItem("nPG")){
      window.sessionStorage.setItem("nPG",-1);
    }

    setTimeout(function(){
      //titulo
      if(window.sessionStorage.getItem("titulo")){
        $("#inputTitulo").val(window.sessionStorage.getItem("titulo"));
        //descricao
        $("#inputDescricao").val(window.sessionStorage.getItem("descricao"));
        //indexAno
        var obj = document.getElementById("selectAno");
        obj.selectedIndex = window.sessionStorage.getItem("indexAno");
        //indexDiscipl
        obj = document.getElementById("selectDiscip");
        obj.selectedIndex = window.sessionStorage.getItem("indexDiscipl");
        window.sessionStorage.removeItem("titulo");
        window.sessionStorage.removeItem("descricao");
        window.sessionStorage.removeItem("indexAno");
        window.sessionStorage.removeItem("indexDiscipl");
        self.getPerguntas();
      }

      //parar os players quando se fecham os modal's
      var modals = document.getElementsByClassName('modal');
      for (var i = 0; i < modals.length; i++) {
        $(modals[i]).on('hide.bs.modal', function (e) {
          var players = document.getElementsByClassName('players');
          for (var j = 0; j < players.length; j++) {
            players[j].pause();
          }
        });
      }


    },50);



    return this;
  },

  vaiClonar: function(teste){
    var self=this;
    modem('GET', 'tests/'+teste, function(item) {
      $("#inputTitulo").val("Colne de "+item.titulo);
      $("#inputDescricao").val(item.descricao);
        //disciplina
        switch (item.disciplina) {
          case "Português":
              document.getElementById("selectDiscip").selectedIndex=0;
            break;
          case "Inglês":
              document.getElementById("selectDiscip").selectedIndex=1;
            break;

          case "Outra língua":
              document.getElementById("selectDiscip").selectedIndex=2;
            break;

          case "Matemática":
              document.getElementById("selectDiscip").selectedIndex=3;
            break;

          case "Estudo do Meio":
              document.getElementById("selectDiscip").selectedIndex=4;
            break;
          default:
              document.getElementById("selectDiscip").selectedIndex=5;
        }
        //ano escolar
        document.getElementById("selectAno").selectedIndex=(parseInt(item.anoEscolar) - 1 );

        //perguntas
        for (var i = 0; i < item.perguntas.length; i++) {
          modem('GET', 'questions/'+item.perguntas[i], function(perg) {
            var opt='';
            var date = new Date(perg.dataCri);
            var day = date.getDate().toString();
            var month = (date.getMonth()+1).toString();
            var year = date.getFullYear().toString();
            var hours = date.getHours().toString();
            var minutes = date.getMinutes().toString();
            day = day.length === 2 ? day : '0' + day;
            month = month.length === 2 ? month : '0' + month;
            hours = hours.length === 2 ? hours : '0' + hours;
            minutes = minutes.length === 2 ? minutes : '0' + minutes;

            opt='<option value="'+perg._id+'" class="pergunta"> -> '
                +perg.titulo+' - '+day+'.'+month+'.'+year+'</option>';

            $("#newlistMultQuestions").append(opt);
            self.verCamposTeste();

          }, function(errQ) {
            console.log('Error getting question '+item.perguntas[i]);
            console.log(errQ);
          });

        }
        $("#multBadge2").text(item.perguntas.length);

        //desbloquear os inputs
        $("#inputTitulo").attr("disabled",false);
        $("#inputDescricao").attr("disabled",false);
        $("#listMultQuestions").attr("disabled",false);
        $("#newlistMultQuestions").attr("disabled",false);
        $("#criarPerg").attr("disabled",false);
        self.getPerguntas();


    }, function(erro) {
      console.log('Error getting test '+teste);
      console.log(erro);
    });
  },

  getPerguntas:function(){
    //Modem para consultar as questões do tipo multimédia da disciplina seleccionada e ano escolar
    //Constrir as opções
    modem('GET', '/questions', function(data) {
      //limpar lista
      var list = document.getElementById("listMultQuestions");
      for(i=0; i< list.length; list.remove(0));

      //Aplicar o filtro
      var lista = new Array();
      var selAno = document.getElementById("selectAno");
      var ind = selAno.selectedIndex;

      var selDiscip = document.getElementById("selectDiscip");
      var ind2 = selDiscip.selectedIndex;
      var nOpt=0;

      for(i=0; i<data.length; i++){
        //por tipo, ano e disciplina
        if( data[i].doc.estado &&
          data[i].doc.tipoTeste == "Multimédia" &&
          parseInt(data[i].doc.anoEscolar) == parseInt(selAno.item(ind).text) &&
          data[i].doc.disciplina == selDiscip.item(ind2).text){
            var opt='';

            var date = new Date(data[i].doc.dataCri);
            var day = date.getDate().toString();
            var month = (date.getMonth()+1).toString();
            var year = date.getFullYear().toString();
            var hours = date.getHours().toString();
            var minutes = date.getMinutes().toString();
            day = day.length === 2 ? day : '0' + day;
            month = month.length === 2 ? month : '0' + month;
            hours = hours.length === 2 ? hours : '0' + hours;
            minutes = minutes.length === 2 ? minutes : '0' + minutes;

            opt='<option value="'+data[i].doc._id+'" class="pergunta"> -> '
                +data[i].doc.titulo+' - '+day+'.'+month+'.'+year+'</option>';
            nOpt++;
            $("#listMultQuestions").append(opt);
          }

          $("#multBadge").text(nOpt);
      }

    }, function(error) {
      console.log('Error getting questions list!');
    });
  },
});
