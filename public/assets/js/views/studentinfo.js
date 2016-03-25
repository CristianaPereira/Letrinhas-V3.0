
window.StudentInfo = Backbone.View.extend({
  events:{
    "click #btnStudentEdit": "editStudent",
  },

  editStudent: function (e) {
    console.log(e.toElement);
    //Variavel a enviar, para depois poder buscar os dados do professor a editar
    window.sessionStorage.setItem("AlunoEditar", self.aluno);
    app.navigate('/man', {//teachers/edit', {
      trigger: true
    });
  },

  initialize: function () {
    var self=this;

    self.bd='dev_alunos';
    self.bd2='dev_escolas';
    self.site=process.env.COUCHDB;
    self.aluno;
  },


  render: function () {
    var self=this;
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

    modem('GET', 'teachers/'+window.localStorage.getItem("ProfID"), function(data) {
      $("#user").text(data.nome);
    }, function(error) {
      console.log('Error getting user '+window.localStorage.getItem("ProfID"));
    });

    self.aluno = window.sessionStorage.getItem("Aluno");
    console.log(self.aluno);

    modem('GET', 'students/'+self.aluno, function(aluno) {
      $("#nome").text(aluno.nome);
      $("#numAluno").text(aluno.numero);
      $("#studentFoto").attr("src",self.site+'/'+self.bd+'/'+self.aluno+'/aluno.jpg');
      modem('GET', 'schools/'+aluno.escola, function(escola) {
        for (var i = 0; i < escola.turmas.length; i++) {
          if(escola.turmas[i]._id==aluno.turma){
            $("#turma").html(escola.turmas[i].ano+'º '+ escola.turmas[i].nome
                            +', <br>'+escola.nome);
          }
        }
      }, function(erro1) {
        console.log('Error getting school'+aluno.escola+', '+erro1);
      });


      //#################################################
      //1ºfazer a importação dos dados e construir o gráfico
      var contaPorCorrigir=0;
      var listaNotas = new Array();
      var legends = new Array();
      modem('GET', 'submissions', function(resolucoes){
        console.log(resolucoes.length+' resoluções');
        for (var i = 0; i < 10; i++){//resolucoes.length; i++) {
          //console.log(resolucoes[i].doc);
          //console.log("data: "+resolucoes[i].doc.dataReso);
          if(resolucoes[0].doc.id_Aluno == self.aluno){
            if(resolucoes[0].doc.nota<0){
              contaPorCorrigir++;
            }
            //else {
              var data = new Date((i+1)+'-08-2015');
              var day = data.getDate();
              var month = data.getMonth()+1;
              var hours = data.getHours();
              var minutes = data.getMinutes();
              day = day.length === 2 ? day : '0' + day;
              month = month.length === 2 ? month : '0' + month;
              hours = hours.length === 2 ? hours : '0' + hours;
              minutes = minutes.length === 2 ? minutes : '0' + minutes;
              var dataFinal = day + "/" + month + "/" + data.getFullYear() + " - " + hours + ":" + minutes + "h";

              listaNotas.push(i*Math.random()+1)//resolucoes[i].doc.nota);
              legends.push(dataFinal);

            //}
          }
        }
        if(listaNotas.length>0){
          var lineChartData = {
            labels: legends,  ///aarray de labels para o gráfico que representa
            datasets: [{
              label: "Notas",
              fillColor: "rgba(255,100,100,0.2)",
              strokeColor: "rgba(255,170,170,1)",
              pointColor: "rgba(255,170,170,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(255,170,170,1)",
              data: listaNotas        ///// array de valores
            }]
          }
          self.myLineGraData = lineChartData;
          var ctx = document.getElementById("evoGrafico").getContext("2d");
          var myLineChart = new Chart(ctx).Line(lineChartData, { responsive: true,
            showScale: true,
            bezierCurve : true,
            scaleOverride: true,
            animationEasing: "easeOutBounce",
            // Number - The number of steps in a hard coded scale
              scaleSteps: 5,
            // Number - The value jump in the hard coded scale
           scaleStepWidth: 20,
           // Number - The scale starting value
           scaleStartValue: 0,
           tooltipTemplate: "<%= datasetLabel %> - <%= value %> %",
            legendTemplate: '<% for (var i=0; i<datasets.length; i++){%>' +
              '<span class="glyphicon glyphicon-stop" style=" color: <%=datasets[i].strokeColor%>; font-size: 24pt">' +
              '</span><span style="font-size: 20pt"> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></span>&nbsp&nbsp&nbsp' +
              '&nbsp&nbsp<%}%>'
          });
        }
        else{
          $("#lblGrInfo").text("Sem dados para gerar gráfico de evolução.");
          $("#pdLoad").attr("style","display:none");
        }


          //#############################################*/

          if(contaPorCorrigir>0){
            $("#lblResolut").text("Tem "+contaPorCorrigir+" resoluções por corrigir");
            $("#panelResolucoes").attr("style","height:90px; ");
          }
      }, function(erro2) {
        console.log('Error getting school'+aluno.escola+', '+erro2);
      });

      //verificar se existem resoluções por corrigir e se tem permissões de corrigir este aluno
      //, se sim mostra o alert e o botão
      //#################################################


    }, function(error) {
      console.log('Error getting student'+self.aluno+', '+error);
    });





    return this;
  }

});
