var Ticket = Backbone.Model.extend({
  initialize: function (options) {
    this.ticketid = options.ticketid;
  },
  fetch: function (after_fetch) {
    var self = this;

    //console.log(this.ticketid);
    modem('GET', 'support/tickets/' + this.ticketid,
      function (json) {
        //console.log(json);
        switch (json.ticket.status) {
          case 1:
            self.set("newstatus", 'In Queue');
            break;
          case 2:
            self.set("newstatus", 'In Progress');
            break;
          case 3:
            self.set("newstatus", 'Closed');
            break;
          case 4:
            self.set("newstatus", 'Waiting Costumer');
            break;
          case 5:
            self.set("newstatus", 'Under Review');
            break;
        }

        var date = new Date(parseInt(json.ticket.created) * 1000);
        var sdate = formatdate(date);

        self.set("newcreation_time", sdate);
        self.set("creation_time", json.ticket.created);
        self.set("id", json.ticket.id);
        self.set("status", json.ticket.status);
        self.set("replies", json.ticket.posts.length);

        after_fetch();
      },
      function (xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        error_launch(json.message);
      });
  }
});
